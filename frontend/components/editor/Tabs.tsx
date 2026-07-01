"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileStore } from "@/store/file.store";

export default function Tabs() {
  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const closeFile = useFileStore((s) => s.closeFile);

  return (
    <div className="flex h-7 items-center border border-white/8 bg-neutral-950">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => setActiveFile(file.id)}
          data-active={file.id === activeFileId}
          className="flex items-center gap-2 border border-stone-900 px-3 text-xs text-neutral-400 data-[active=true]:bg-stone-900 data-[active=true]:text-white"
        >
          <span>{file.name}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
          >
            <X />
          </Button>
        </div>
      ))}
    </div>
  );
}
