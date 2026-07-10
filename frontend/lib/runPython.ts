import { useFileStore } from "@/store/file.store";
import { useUiStore } from "@/store/ui.store";
import { useTerminalStore } from "@/store/terminal.store";
import { getLanguageInfo } from "@/lib/language";

export function runActiveFilePython() {
  const { files, activeFileId } = useFileStore.getState();
  const file = files.find((f) => f.id === activeFileId);
  if (!file || getLanguageInfo(file.name).id !== "python") return;

  useUiStore.getState().setTerminalOpen(true);
  useTerminalStore.getState().requestRun(file.content);
}
