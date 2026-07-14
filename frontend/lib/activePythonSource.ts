import { useFileStore } from "@/store/file.store";
import { getLanguageInfo } from "./language";

export interface ActivePythonSource {
  id: string;
  content: string;
  isDirty: boolean;
}

export function getActivePythonSource(): ActivePythonSource | null {
  // NOTE: Get the active python file from editor
  const { files, activeFileId } = useFileStore.getState();
  const file = files.find((f) => f.id === activeFileId);
  // NOTE: If no file or not a python file, return null
  if (!file || getLanguageInfo(file.name).id !== "python") return null;
  return { id: file.id, content: file.content, isDirty: file.content !== file.savedContent };
}
