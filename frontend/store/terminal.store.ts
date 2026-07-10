import { create } from "zustand";

export type ShellType = "cmd" | "powershell" | "bash";

interface TerminalState {
  shell: ShellType;
  setShell: (shell: ShellType) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  shell: "powershell",
  setShell: (shell) => set({ shell }),
}));
