import { create } from "zustand";

export interface FolderNode {
  kind: "file" | "directory";
  name: string;
  path: string;
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FolderNode[];
}

async function readChildren(
  dirHandle: FileSystemDirectoryHandle,
  parentPath: string,
): Promise<FolderNode[]> {
  const entries: FolderNode[] = [];
  for await (const [name, handle] of dirHandle.entries()) {
    entries.push({
      kind: handle.kind,
      name,
      path: `${parentPath}/${name}`,
      handle,
    } as FolderNode);
  }
  return entries.sort((a, b) =>
    a.kind !== b.kind
      ? a.kind === "directory"
        ? -1
        : 1
      : a.name.localeCompare(b.name),
  );
}

interface FolderState {
  root: FolderNode | null;
  expanded: Set<string>;
  openFolder: () => Promise<void>;
  toggleExpand: (node: FolderNode) => Promise<void>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  root: null,
  expanded: new Set(),
  openFolder: async () => {
    if (!("showDirectoryPicker" in window)) {
      alert("Open Folder isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    const dirHandle = await window.showDirectoryPicker();
    const children = await readChildren(dirHandle, dirHandle.name);
    set({
      root: {
        kind: "directory",
        name: dirHandle.name,
        path: dirHandle.name,
        handle: dirHandle,
        children,
      },
      expanded: new Set([dirHandle.name]),
    });
  },
  toggleExpand: async (node) => {
    const expanded = new Set(get().expanded);
    if (expanded.has(node.path)) {
      expanded.delete(node.path);
      set({ expanded });
      return;
    }
    expanded.add(node.path);
    if (!node.children) {
      node.children = await readChildren(
        node.handle as FileSystemDirectoryHandle,
        node.path,
      );
    }
    const root = get().root;
    set({ expanded, root: root ? { ...root } : null });
  },
}));
