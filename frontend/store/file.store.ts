import { create } from "zustand";

export interface FileTab {
  id: string;
  name: string;
  content: string;
  handle?: FileSystemFileHandle;
}

interface FileState {
  files: FileTab[];
  activeFileId: string | null;
  newFile: () => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  openFileFromHandle: (handle: FileSystemFileHandle) => Promise<void>;
  openFile: () => Promise<void>;
}

function createUntitledFile(): FileTab {
  return {
    id: crypto.randomUUID(),
    name: `Untitled`,
    content: "",
  };
}

const initialFile = createUntitledFile();

export const useFileStore = create<FileState>((set, get) => ({
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
  openFileFromHandle: async (handle) => {
    const existing = get().files.find((f) => f.handle === handle);
    if (existing) {
      set({ activeFileId: existing.id });
      return;
    }
    const file = await handle.getFile();
    const content = await file.text();
    const id = crypto.randomUUID();
    set((state) => ({
      files: [...state.files, { id, name: file.name, content, handle }],
      activeFileId: id,
    }));
  },
  openFile: async () => {
    if (!("showOpenFilePicker" in window)) {
      alert("Open File isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    let handles: FileSystemFileHandle[];
    try {
      handles = await window.showOpenFilePicker({ multiple: true });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      throw error;
    }
    for (const handle of handles) {
      await get().openFileFromHandle(handle);
    }
  },
}));
