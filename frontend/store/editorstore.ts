
import { create } from "zustand";

interface EditorStore {
  code: string;
  setCode: (code: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: "",
  setCode: (code: string) => set({ code })
}));
