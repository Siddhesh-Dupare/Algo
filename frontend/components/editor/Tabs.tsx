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
    <div className="flex h-7 items-center border border-border bg-muted">
      {files.map((file) => {
        const isDirty = file.content !== file.savedContent;
        return (
          <div
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            data-active={file.id === activeFileId}
            className="group flex items-center gap-2 border border-border px-3 text-xs text-muted-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground"
          >
            <span>{file.name}</span>
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              {isDirty && (
                <span className="size-2 rounded-full bg-foreground group-hover:hidden" />
              )}
              <Button
                size="icon"
                variant="ghost"
                className={`absolute inset-0 h-7 w-7 cursor-pointer ${
                  isDirty ? "hidden group-hover:flex" : "flex"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
              >
                <X />
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
