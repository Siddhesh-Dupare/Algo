import { create } from "zustand";

export interface FileTab {
  id: string;
  name: string;
  content: string;
  savedContent: string;
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
  saveFile: (id: string) => Promise<void>;
  saveFileAs: (id: string) => Promise<void>;
  saveAllFiles: () => Promise<void>;
}

async function writeToHandle(handle: FileSystemFileHandle, content: string) {
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

function createUntitledFile(): FileTab {
  return {
    id: crypto.randomUUID(),
    name: `Untitled`,
    content: "",
    savedContent: "",
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
      files: [
        ...state.files,
        { id, name: file.name, content, savedContent: content, handle },
      ],
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
  saveFile: async (id) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;
    if (!file.handle) {
      await get().saveFileAs(id);
      return;
    }
    await writeToHandle(file.handle, file.content);
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, savedContent: f.content } : f,
      ),
    }));
  },
  saveFileAs: async (id) => {
    if (!("showSaveFilePicker" in window)) {
      alert("Save isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    const file = get().files.find((f) => f.id === id);
    if (!file) return;
    let handle: FileSystemFileHandle;
    try {
      handle = await window.showSaveFilePicker({ suggestedName: file.name });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      throw error;
    }
    await writeToHandle(handle, file.content);
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, handle, name: handle.name, savedContent: f.content }
          : f,
      ),
    }));
  },
  saveAllFiles: async () => {
    const dirtyIds = get()
      .files.filter((f) => f.content !== f.savedContent)
      .map((f) => f.id);
    for (const id of dirtyIds) {
      await get().saveFile(id);
    }
  },
}));
