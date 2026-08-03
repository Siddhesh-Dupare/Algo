import { leftToggleData } from "./data/statusbar";

import { Toggle } from "@/components/ui/toggle";

export default function LeftComponent() {
  return (
    <div>
      {leftToggleData.map((toggle, index) => (
        <Toggle
          size="sm"
          key={index}
          aria-label={toggle.label}
          // pressed={pressedById[toggle.id] ?? false}
          // onPressedChange={() => toggle.action?.()}
        >
          <toggle.icon size={12} />
        </Toggle>
      ))}
    </div>
  );
}
