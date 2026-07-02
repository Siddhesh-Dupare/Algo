"use client";

import { useUiStore } from "@/store/ui.store";
import FileTree from "./FileTree";

export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  if (!sidebarOpen) return null;

  return (
    <div className="w-56 shrink-0 border-r border-border bg-muted/30">
      <FileTree />
    </div>
  );
}
