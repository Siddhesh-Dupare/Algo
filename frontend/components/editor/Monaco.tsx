"use client";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import Tabs from "./Tabs";
import NoFile from "./NoFile";
import { useFileStore } from "@/store/file.store";
import { useThemeStore } from "@/store/theme.store";
import { useEditorStore } from "@/store/editor.store";

export default function MonacoEditor() {
  const file = useFileStore((s) =>
    s.files.find((f) => f.id === s.activeFileId),
  );
  const updateFileContent = useFileStore((s) => s.updateFileContent);
  const setEditor = useEditorStore((s) => s.setEditor);

  const handleChange: OnChange = (value) => {
    if (file) updateFileContent(file.id, value ?? "");
  };

  const handleMount: OnMount = (editorInstance) => {
    setEditor(editorInstance);
    editorInstance.onDidDispose(() => setEditor(null));
  };

  const theme = useThemeStore((s) => s.theme);

  return (
    <div className="flex h-full flex-col">
      {file ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <Tabs />
          <Editor
            key={file.id}
            height="100%"
            theme={theme === "dark" ? "vs-dark" : "light"}
            language="python"
            value={file.content}
            onChange={handleChange}
            onMount={handleMount}
            options={{ fontSize: 13, minimap: { enabled: false } }}
          />
        </div>
      ) : (
        <NoFile />
      )}
    </div>
  );
}
