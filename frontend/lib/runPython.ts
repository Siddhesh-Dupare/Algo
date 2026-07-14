import { useFileStore } from "@/store/file.store";
import { useUiStore } from "@/store/ui.store";
import { useTerminalStore } from "@/store/terminal.store";
import { getActivePythonSource } from "./activePythonSource";
import { useUnsavedChangesDialogStore } from "@/store/unsavedChangesDialog";

async function proceedWithRun(id: string, content: string) {
  await useFileStore.getState().saveFile(id);
  useUiStore.getState().setTerminalOpen(true);
  useTerminalStore.getState().requestRun(content);
}

export async function runActiveFilePython() {
  const source = getActivePythonSource();
  if (source === null) return;

  if (source.isDirty) {
    useUnsavedChangesDialogStore.getState().request(() => {
      void proceedWithRun(source.id, source.content);
    });
    return;
  }

  useUiStore.getState().setTerminalOpen(true);
  useTerminalStore.getState().requestRun(source.content);
}
