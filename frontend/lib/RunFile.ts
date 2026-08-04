
import { webSocket } from "@/websocket/WebSocketService";
import { useEditorStore } from "@/store/editorstore";

export async function runActiveFile() {
  const code = useEditorStore.getState().code;
  webSocket.send({
    type: "EXECUTE",
    requestId: "001",
    input: "",
    language: "python",
    code: code,
  });
}
