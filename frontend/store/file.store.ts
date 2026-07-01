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
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
}

function createUntitledFile(): FileTab {
  return {
    id: crypto.randomUUID(),
    name: `Untitled`,
    content: "",
  };
}

const initialFile = createUntitledFile();

export const useFileStore = create<FileState>((set) => ({
  files: [initialFile],
  activeFileId: initialFile.id,
  // New File Menu
  newFile: () => {
    const file = createUntitledFile();
    set((state) => ({
      files: [...state.files, file],
      activeFileId: file.id,
    }));
  },
  closeFile: (id) =>
    set((state) => {
      const files = state.files.filter((f) => f.id != id);
      const activeFileId =
        state.activeFileId === id
          ? (files[files.length - 1]?.id ?? null)
          : state.activeFileId;
      return { files, activeFileId };
    }),
  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, content } : f)),
    })),
}));
