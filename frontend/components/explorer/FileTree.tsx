"use client";

import {
  ChevronRight,
  Folder,
  FolderOpen,
  File as FileIcon,
} from "lucide-react";
import { useFolderStore, type FolderNode } from "@/store/folder.store";
import { useFileStore } from "@/store/file.store";

import { Button } from "../ui/button";

function TreeRow({ node, depth }: { node: FolderNode; depth: number }) {
  const expanded = useFolderStore((s) => s.expanded.has(node.path));
  const toggleExpand = useFolderStore((s) => s.toggleExpand);
  const openFileFromHandle = useFileStore((s) => s.openFileFromHandle);
  const activeHandle = useFileStore(
    (s) => s.files.find((f) => f.id === s.activeFileId)?.handle,
  );

  const isDir = node.kind === "directory";
  const isActive = !isDir && node.handle === activeHandle;

  return (
    <div>
      <div
        onClick={() =>
          isDir
            ? toggleExpand(node)
            : openFileFromHandle(node.handle as FileSystemFileHandle)
        }
        style={{ paddingLeft: depth * 12 + 4 }}
        data-active={isActive}
        className="flex h-6 cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground"
      >
        {isDir ? (
          <ChevronRight
            className={`size-3 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        {isDir ? (
          expanded ? (
            <FolderOpen className="size-3.5 shrink-0" />
          ) : (
            <Folder className="size-3.5 shrink-0" />
          )
        ) : (
          <FileIcon className="size-3.5 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isDir &&
        expanded &&
        node.children?.map((child) => (
          <TreeRow key={child.path} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function FileTree() {
  const root = useFolderStore((s) => s.root);
  const openFolder = useFolderStore((s) => s.openFolder);

  if (!root) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-muted-foreground">
        <span>No folder opened</span>
        <Button
          variant="outline"
          size="sm"
          onClick={openFolder}
          className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-foreground"
        >
          Open Folder
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto py-1">
      <div className="px-2 py-1.5 text-xs font-semibold text-foreground">
        {root.name}
      </div>
      {root.children?.map((child) => (
        <TreeRow key={child.path} node={child} depth={1} />
      ))}
    </div>
  );
}
