"use client";

import { useEffect } from "react";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { webSocket } from "@/websocket/WebSocketService";
import { useEditorStore } from "@/store/editorstore";

export default function MonacoEditor() {
  const code = useEditorStore((state) => state.code);
  const setCode = useEditorStore((state) => state.setCode);

  useEffect(() => {
    webSocket.connect();

    return () => {
      webSocket.disconnect();
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme={"vs-dark"}
          language="python"
          options={{ fontSize: 13, minimap: { enabled: false } }}
          value={code}
          onChange={(value) => setCode(value ?? "")}
        />
      </div>
    </div>
  );
}
