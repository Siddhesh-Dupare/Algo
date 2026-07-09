
import { leftToggleData, rightToggleData } from "./toggle.data";

import { Toggle } from "../ui/toggle";
import { useUiStore } from "@/store/ui.store";

export function LeftToggleButtons() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const pressedById: Record<string, boolean> = {
    "project-panel": sidebarOpen,
  };

  return (<div>
    {leftToggleData.map((toggle, index) => (
      <Toggle
        size="sm"
        key={index}
        aria-label={toggle.label}
        pressed={pressedById[toggle.id] ?? false}
        onPressedChange={() => toggle.action?.()}
      >
        <toggle.icon size={12} />
      </Toggle>
    ))}
  </div>);
}

export function RightToggleButtons() {
  return (<div>
    {rightToggleData.map((toggle, index) => (
      <Toggle
        size="sm"
        key={index}
        aria-label={toggle.label}
        onPressedChange={() => toggle.action?.()}
      >
        <toggle.icon size={12} />
      </Toggle>
    ))}
  </div>)
}
