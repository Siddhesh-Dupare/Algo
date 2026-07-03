import { create } from "zustand";

interface CommandState {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export const useCommandStore = create<CommandState>((set) => ({
  dialogOpen: false,
  setDialogOpen: (open) => set({ dialogOpen: open }),
}));
