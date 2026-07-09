import { type LucideIcon, Play, Bug } from "lucide-react";

export interface ExecutionData {
  id: string;
  trigger: string;
  status: string;
  icon: LucideIcon;
}

export const executionData: ExecutionData[] = [
  {
    id: "run",
    trigger: "Play",
    status: "Not Running",
    icon: Play
  }, {
    id: "debug",
    trigger: "Debug",
    status: "Not Running",
    icon: Bug
  }
]
