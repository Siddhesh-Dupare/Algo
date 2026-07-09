"use client";

import { useActiveFileLanguage } from "@/lib/language";

export default function StatusBar() {
  const language = useActiveFileLanguage();

  return (
    <div className="flex h-9 items-center justify-between">
      <span className="text-sm">{language.label}</span>
    </div>
  );
}
