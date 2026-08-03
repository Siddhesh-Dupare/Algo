import { type LucideIcon, Minus, Square, X } from "lucide-react";

export type WindowControl = {
  id: string;
  label: string;
  symbol: LucideIcon;
  method: string;
  color: string;
};

export const windowConfig: WindowControl[] = [
  {
    id: "min",
    label: "Minimize",
    symbol: Minus,
    method: "minimizeWindow",
    color: "hover:bg-gray-500",
  },
  {
    id: "max",
    label: "Maximize",
    symbol: Square,
    method: "maximizeWindow",
    color: "hover:bg-gray-500",
  },
  {
    id: "close",
    label: "Close",
    symbol: X,
    method: "closeWindow",
    color: "hover:bg-red-500",
  },
];
