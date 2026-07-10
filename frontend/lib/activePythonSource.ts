import { useFileStore } from "@/store/file.store";
import { getLanguageInfo } from "@/lib/language";

export function getActivePythonSource(): string | null {
  const { files, activeFileId } = useFileStore.getState();
  const file = files.find((f) => f.id === activeFileId);
  if (!file || getLanguageInfo(file.name).id !== "python") return null;
  return file.content;
}
