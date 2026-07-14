import { useUnsavedChangesDialogStore } from "@/store/unsavedChangesDialog";
import { getActivePythonSource } from "./activePythonSource";
import { useFileStore } from "@/store/file.store";

const BACKEND_WS_URL = "ws://localhost:3001";

export async function startDebugSocket(code: string) {
  const ws = new WebSocket(BACKEND_WS_URL);

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: "debug", code }));
  });

  ws.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === "trace-complete") {
        console.log("[AlgoLens Debug] trace complete ", message);
        ws.close();
      }
      else if (message.type === "trace-error") {
        console.error("[AlgoLens Debug] trace error ", message.message);
        ws.close();
      }
    } catch (e) {
      // TODO: Create an error when message is invalid
      console.error("Failed to parse message from backend", e);
      ws.close();
    }
  });

  ws.addEventListener("error", () => {
    console.log("[AlgoLens Debug] failed to connect to backend at ", BACKEND_WS_URL);
  });
}

async function proceedWithDebug(id: string, content: string) {
  await useFileStore.getState().saveFile(id);
  startDebugSocket(content);
}

export function debugActiveFilePython() {
  const source = getActivePythonSource();
  if (source === null) {
    console.log("[AlgoLens Debug] no active python file");
    return;
  }

  if (source.isDirty) {
    useUnsavedChangesDialogStore.getState().request(() => {
      void proceedWithDebug(source.id, source.content);
    });
    return;
  }

  startDebugSocket(source.content);
}
