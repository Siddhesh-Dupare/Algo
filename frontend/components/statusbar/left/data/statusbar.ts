
import { type LucideIcon, FolderTree  } from "lucide-react";

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
  }
]
