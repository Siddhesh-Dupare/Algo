"use client";

import { useThemeStore } from "@/store/theme.store";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";

export default function ThemeCommand() {
  const open = useThemeStore((s) => s.dialogOpen);
  const setDialogOpen = useThemeStore((s) => s.setDialogOpen);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  return (
    <CommandDialog
      open={open}
      onOpenChange={setDialogOpen}
      title="Select Theme"
      description="Choose a color theme"
    >
      <CommandInput placeholder="Search theme..." />
      <CommandList>
        <CommandEmpty>No theme found.</CommandEmpty>
        <CommandGroup heading="Theme">
          <CommandItem
            data-checked={theme === "light"}
            onSelect={() => {
              setTheme("light");
              setDialogOpen(false);
            }}
          >
            Light
          </CommandItem>
          <CommandItem
            data-checked={theme === "dark"}
            onSelect={() => {
              setTheme("dark");
              setDialogOpen(false);
            }}
          >
            Dark
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
