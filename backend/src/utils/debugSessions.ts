import type WebSocket from "ws";
import { getPythonPath } from "./pathResolver.js";
import path from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { spawn } from "child_process";

const TRACER_PATH = path.join(process.cwd(), "src", "tracer", "pythonTracer.py");
const TRACE_LINE_PREFIX = "__ALGOLENS_TRACE__";

const desktopSockets = new Set<WebSocket>();

export function registerDesktopSocket(ws: WebSocket) {
  desktopSockets.add(ws);
  ws.once("close", () => {
    desktopSockets.delete(ws);
  })
}

function broadcastToDesktop(message: unknown) {
  const payload = JSON.stringify(message);
  for (const socket of desktopSockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }
}

export async function handleDebugRequest(triggerWs: WebSocket, code: string) {
  // NOTE: If no desktop clients are connected, send an error and return early
  if (desktopSockets.size === 0) {
    triggerWs.send(JSON.stringify({
      type: "trace-error",
      message: "No desktop clients connected"
    }))
    return;
  }

  // NOTE: Look up the Python path
  const pythonPath = await getPythonPath();
  if (!pythonPath) {
    triggerWs.send(JSON.stringify({
      type: "trace-error",
      message: "Could not find a Python installation."
    }))
    return;
  }

  // NOTE: Write the code to a temporary file
  const tempFilePath = path.join(tmpdir(), `algolens-debug-${randomUUID()}.py`);
  await writeFile(tempFilePath, code, "utf-8");

  // NOTE: Spawn the Python tracer process
  const child = spawn(pythonPath, [TRACER_PATH, tempFilePath]);

  let buffer = ""
  let stderrOutput = "";

  child.stdout.on("data", (chunk: Buffer) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith(TRACE_LINE_PREFIX)) continue;
      try {
        const step = JSON.parse(line.slice(TRACE_LINE_PREFIX.length));
        broadcastToDesktop({ type: "trace-step", step });
      } catch {
        // TODO: handle parse error
      }
    }
  });

  child.stderr.on("data", (chunk: Buffer) => {
    stderrOutput += chunk.toString();
  });

  child.on("close", async (exitCode) => {
    await unlink(tempFilePath).catch(() => {
      // TODO: handle unlink error
    });
    if (exitCode == 0) {
      broadcastToDesktop({ type: "trace-complete" });
      triggerWs.send(JSON.stringify({ type: "trace-complete" }));
    } else {
      const message = stderrOutput.trim() || `Tracer exited with code ${exitCode}`;
      broadcastToDesktop({ type: "trace-error", message });
      triggerWs.send(JSON.stringify({ type: "trace-error", message }));
    }
  });

}
