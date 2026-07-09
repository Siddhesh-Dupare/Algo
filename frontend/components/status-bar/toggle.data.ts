
import { type LucideIcon, FolderTree, SquareTerminal  } from "lucide-react";

import { useUiStore } from "@/store/ui.store";

interface ToggleData {
  id: string;
  label: string;
  icon: LucideIcon;
  action?: () => void;
}

export const leftToggleData: ToggleData[] = [
  {
    id: "project-panel",
    label: "Project Panel",
    icon: FolderTree,
    action: () => useUiStore.getState().toggleSidebar(),
  }
]

export const rightToggleData: ToggleData[] = [
  {
    id: "terminal-panel",
    label: "Terminal Panel",
    icon: SquareTerminal ,
  }
]
