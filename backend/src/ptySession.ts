import type WebSocket from "ws";
import { spawn } from "node-pty";
import type { IPty } from "node-pty";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { resolveShellPath, type ShellType } from "./utils/shellResolver.js";
import { getPythonPath } from "./utils/pathResolver.js";
import { registerDesktopSocket, handleDebugRequest } from "./utils/debugSessions.js";

interface ClientMessage {
  type: "start" | "input" | "resize" | "run" | "register" | "debug";
  shell?: ShellType;
  data?: string;
  cols?: number;
  rows?: number;
  code?: string;
  role?: "desktop";
}

export function handleConnection(ws: WebSocket) {
  let ptyProcess: IPty | undefined;
  let currentShell: ShellType | undefined;
  let sessionReady: Promise<void> = Promise.resolve();

  const startSession = async (shell: ShellType, cols: number, rows: number) => {
    ptyProcess?.kill();
    currentShell = shell;

    const shellPath = await resolveShellPath(shell);
    if (!shellPath) {
      ws.send(JSON.stringify({ type: "error", message: `Could not resolve path for shell: ${shell}` }));
      return;
    }

    ptyProcess = spawn(shellPath, [], {
      name: "xterm-color",
      cols,
      rows,
      cwd: process.env.USERPROFILE ?? process.cwd(),
      env: process.env as Record<string, string>,
    });

    ptyProcess.onData((data) => {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify({ type: "data", data }));
    });

    ptyProcess.onExit(({ exitCode }) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "exit", code: exitCode }));
      }
    });
  };

  const runPython = async (code: string) => {
    await sessionReady;
    if (!ptyProcess) {
      ws.send(JSON.stringify({ type: "error", message: "No active terminal session to run in." }));
      return;
    }

    const pythonPath = await getPythonPath();
    if (!pythonPath) {
      ws.send(JSON.stringify({ type: "error", message: "Could not find a Python installation." }));
      return;
    }

    const tempFilePath = path.join(tmpdir(), `algolens-${randomUUID()}.py`);
    await writeFile(tempFilePath, code, "utf-8");

    // PowerShell doesn't invoke a leading quoted string as a command (it's
    // parsed as a plain expression) — it needs the call operator `&`. cmd
    // and bash both run `"path" "arg"` directly.
    const command =
      currentShell === "powershell"
        ? `& "${pythonPath}" "${tempFilePath}"\r`
        : `"${pythonPath}" "${tempFilePath}"\r`;
    ptyProcess.write(command);
  };

  ws.on("message", (raw) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.type) {
      case "start":
        if (msg.shell) sessionReady = startSession(msg.shell, msg.cols ?? 80, msg.rows ?? 24);
        break;
      case "input":
        if (msg.data) ptyProcess?.write(msg.data);
        break;
      case "resize":
        if (msg.cols && msg.rows) ptyProcess?.resize(msg.cols, msg.rows);
        break;
      case "run":
        if (msg.code) void runPython(msg.code);
        break;
      case "register":
        if (msg.role === "desktop") registerDesktopSocket(ws);
        break;
      case "debug":
        if (msg.code) void handleDebugRequest(ws, msg.code);
        break;
    }
  });

  ws.on("close", () => {
    ptyProcess?.kill();
  });
}
