"use client";

import Menu from "./menu/Menu";
import WindowMenu from "./windowMenu/WindowMenu";

export default function MenuBar() {
  return (
    <div className="flex h-9 select-none items-center justify-between border-b border-border pl-2">
      <div className="flex items-center gap-1">
        <Menu />
      </div>
      <WindowMenu />
    </div>
  );
}
