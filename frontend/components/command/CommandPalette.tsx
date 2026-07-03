"use client";

import { useCommandStore } from "@/store/command.store";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "../ui/command";

export default function CommandPalette() {
  const open = useCommandStore((s) => s.dialogOpen);
  const setDialogOpen = useCommandStore((s) => s.setDialogOpen);

  return (
    <CommandDialog open={open} onOpenChange={setDialogOpen}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No command found.</CommandEmpty>
        <CommandGroup heading="Commands">
          <CommandItem
            onSelect={() => {
              setDialogOpen(false);
            }}
          >
            AlsoLens: Open Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
