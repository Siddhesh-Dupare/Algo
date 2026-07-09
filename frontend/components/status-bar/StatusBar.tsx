"use client";

import { useActiveFileLanguage } from "@/lib/language";
import { LeftToggleButtons, RightToggleButtons } from "./ToggleButtons";

export default function StatusBar() {
  const language = useActiveFileLanguage();

  return (
    <div className="flex h-9 items-center justify-between">
      <div className="flex items-center gap-2">
        <LeftToggleButtons />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm">{language.label}</span>
        <div className="flex items-center gap-2">
          <RightToggleButtons />
        </div>
      </div>
    </div>
  );
}
