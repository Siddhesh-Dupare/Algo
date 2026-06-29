"use client";

import Editor, { OnChange } from "@monaco-editor/react";
import { useFileStore } from "@/store/file.store";

export default function MonacoEditor() {
  const file = useFileStore((s) =>
    s.files.find((f) => f.id === s.activeFileId),
  );
  const updateFileContent = useFileStore((s) => s.updateFileContent);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No file open
      </div>
    );
  }

  const handleChange: OnChange = (value) => {
    updateFileContent(file.id, value ?? "");
  };

  return (
    <Editor
      key={file.id}
      className="h-full"
      theme="vs-dark"
      language="python"
      value={file.content}
      onChange={handleChange}
      options={{ fontSize: 13, minimap: { enabled: false } }}
    />
  );
}
