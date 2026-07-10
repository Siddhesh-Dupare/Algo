import { create } from "zustand";

export type ShellType = "cmd" | "powershell" | "bash";

interface TerminalState {
  shell: ShellType;
  setShell: (shell: ShellType) => void;
  runRequest: string | null;
  requestRun: (code: string) => void;
  clearRunRequest: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  shell: "powershell",
  setShell: (shell) => set({ shell }),
  runRequest: null,
  requestRun: (code) => set({ runRequest: code }),
  clearRunRequest: () => set({ runRequest: null }),
}));
