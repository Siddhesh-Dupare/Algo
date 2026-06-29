import { create } from "zustand";

export interface FileTab {
  id: string;
  name: string;
  content: string;
}

interface FileState {
  files: FileTab[];
  activeFileId: string | null;
  newFile: () => void;
  setActiveFile: (id: string) => void;
}

let untitledCount = 0;

export const useFileStore = create<FileState>((set) => ({
  files: [],
  activeFileId: null,
  newFile: () => {
    untitledCount += 1;
    const id = crypto.randomUUID();
    set((state) => ({
      files: [
        ...state.files,
        { id, name: `Untitled-${untitledCount}`, content: "" },
      ],
      activeFileId: id,
    }));
  },
  setActiveFile: (id) => set({ activeFileId: id }),
}));
