import { type LucideIcon, Play, Bug } from "lucide-react";
import { runActiveFilePython } from "@/lib/runPython";

export interface ExecutionData {
  id: string;
  trigger: string;
  status: string;
  icon: LucideIcon;
  action?: () => void;
}

export const executionData: ExecutionData[] = [
  {
    id: "run",
    trigger: "Play",
    status: "Not Running",
    icon: Play,
    action: () => runActiveFilePython(),
  }, {
    id: "debug",
    trigger: "Debug",
    status: "Not Running",
    icon: Bug
  }
]
