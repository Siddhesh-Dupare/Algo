import type WebSocket from "ws";
import { spawn } from "node-pty";
import type { IPty } from "node-pty";
import { resolveShellPath, type ShellType } from "./utils/shellResolver.js";

interface ClientMessage {
  type: "start" | "input" | "resize";
  shell?: ShellType;
  data?: string;
  cols?: number;
  rows?: number;
}

export function handleConnection(ws: WebSocket) {
  let ptyProcess: IPty | undefined;

  const startSession = async (shell: ShellType, cols: number, rows: number) => {
    ptyProcess?.kill();

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

  ws.on("message", (raw) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.type) {
      case "start":
        if (msg.shell) void startSession(msg.shell, msg.cols ?? 80, msg.rows ?? 24);
        break;
      case "input":
        if (msg.data) ptyProcess?.write(msg.data);
        break;
      case "resize":
        if (msg.cols && msg.rows) ptyProcess?.resize(msg.cols, msg.rows);
        break;
    }
  });

  ws.on("close", () => {
    ptyProcess?.kill();
  });
}
