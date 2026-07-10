import type WebSocket from "ws";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { getPythonPath } from "./utils/pathResolver.js";

const TRACER_PATH = path.join(process.cwd(), "tracer", "trace.py");

// Must match PREFIX in tracer/trace.py — every real trace line is prefixed
// so the traced script's own stdout (which can coincidentally look like
// valid JSON, e.g. a bare `print(3)`) is never mistaken for a trace step.
const TRACE_LINE_PREFIX = "__ALGOLENS_TRACE__";

const desktopSockets = new Set<WebSocket>();

export function registerDesktopSocket(ws: WebSocket) {
  desktopSockets.add(ws);
  ws.once("close", () => desktopSockets.delete(ws));
}

function broadcastToDesktop(message: unknown) {
  const payload = JSON.stringify(message);
  for (const sock of desktopSockets) {
    if (sock.readyState === sock.OPEN) sock.send(payload);
  }
}

export async function handleDebugRequest(triggerWs: WebSocket, code: string) {
  if (desktopSockets.size === 0) {
    triggerWs.send(JSON.stringify({ type: "trace-error", message: "No desktop app connected." }));
    return;
  }

  const pythonPath = await getPythonPath();
  if (!pythonPath) {
    triggerWs.send(JSON.stringify({ type: "trace-error", message: "Could not find a Python installation." }));
    return;
  }

  const tempFilePath = path.join(tmpdir(), `algolens-debug-${randomUUID()}.py`);
  await writeFile(tempFilePath, code, "utf-8");

  const child = spawn(pythonPath, [TRACER_PATH, tempFilePath]);
  let buffer = "";
  let stderrOutput = "";

  child.stdout.on("data", (chunk: Buffer) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith(TRACE_LINE_PREFIX)) continue; // not a trace line — e.g. the traced script's own print() output
      try {
        const step = JSON.parse(line.slice(TRACE_LINE_PREFIX.length));
        broadcastToDesktop({ type: "trace-step", step });
      } catch {
        // malformed line from tracer stdout — skip, don't crash the handler
      }
    }
  });

  child.stderr.on("data", (chunk: Buffer) => {
    stderrOutput += chunk.toString();
  });

  child.on("close", async (exitCode) => {
    await unlink(tempFilePath).catch(() => {});
    if (exitCode === 0) {
      broadcastToDesktop({ type: "trace-complete" });
      triggerWs.send(JSON.stringify({ type: "trace-complete" }));
    } else {
      const message = stderrOutput.trim() || `Tracer exited with code ${exitCode}`;
      broadcastToDesktop({ type: "trace-error", message });
      triggerWs.send(JSON.stringify({ type: "trace-error", message }));
    }
  });
}
