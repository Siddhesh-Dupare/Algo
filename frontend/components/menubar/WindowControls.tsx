import { windowConfig } from "./window.data";

import { Button } from "@/components/ui/button";

export default function WindowControls() {
  return (
    <div className="flex items-center">
      {windowConfig.map((window, index) => (
        <Button
          key={index}
          aria-label={window.label}
          className={`flex h-9 w-11 items-center justify-center transition-colors rounded-none bg-transparent text-black ${window.color}`}
        >
          <window.symbol className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}
