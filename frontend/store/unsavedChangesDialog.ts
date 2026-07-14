import { create } from "zustand";

interface UnsavedChangesDialogState {
  open: boolean;
  onSaveAndContinue: (() => void) | null;
  request: (onSaveAndContinue: () => void) => void;
  close: () => void;
}

export const useUnsavedChangesDialogStore = create<UnsavedChangesDialogState>((set) => ({
  open: false,
  onSaveAndContinue: null,
  request: (onSaveAndContinue) => set({ open: true, onSaveAndContinue }),
  close: () => set({ open: false, onSaveAndContinue: null }),
}));
