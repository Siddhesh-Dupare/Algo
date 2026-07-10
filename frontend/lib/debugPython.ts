import { getActivePythonSource } from "@/lib/activePythonSource";

const BACKEND_WS_URL = "ws://localhost:3001";

export function debugActiveFilePython() {
  const source = getActivePythonSource();
  if (source === null) return;

  const ws = new WebSocket(BACKEND_WS_URL);

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: "debug", code: source }));
  });

  ws.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "trace-complete") {
        console.log("[AlgoLens Debug] trace complete");
        ws.close();
      } else if (msg.type === "trace-error") {
        console.error("[AlgoLens Debug]", msg.message);
        ws.close();
      }
    } catch {
      // ignore malformed message
    }
  });

  ws.addEventListener("error", () => {
    console.error("[AlgoLens Debug] failed to connect to backend at", BACKEND_WS_URL);
  });
}
