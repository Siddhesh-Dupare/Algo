"use client";

import Editor, {OnChange, OnMount} from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme={"vs-dark"}
          language="python"
          options={{ fontSize: 13, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}
