import { useUiStore } from "@/store/ui.store";
import { useTerminalStore } from "@/store/terminal.store";
import { getActivePythonSource } from "@/lib/activePythonSource";

export function runActiveFilePython() {
  const source = getActivePythonSource();
  if (source === null) return;

  useUiStore.getState().setTerminalOpen(true);
  useTerminalStore.getState().requestRun(source);
}
