"use client";

import Menu from "./Menu";
import WindowControls from "./WindowControls";

export default function MenuBar() {
  return (
    <div className="flex h-9 select-none items-center justify-between border-b border-white/8 pl-2">
      <div className="flex items-center gap-1">
        <span className="px-2 text-xs font-semibold tracking-tight">
          AlgoLens
        </span>
        <Menu />
      </div>
      <WindowControls />
    </div>
  );
}
