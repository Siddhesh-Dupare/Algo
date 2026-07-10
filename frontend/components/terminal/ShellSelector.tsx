"use client";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTerminalStore, type ShellType } from "@/store/terminal.store";

const shellLabel: Record<ShellType, string> = {
  cmd: "Command Prompt",
  powershell: "PowerShell",
  bash: "Git Bash",
};

export default function ShellSelector() {
  const shell = useTerminalStore((s) => s.shell);
  const setShell = useTerminalStore((s) => s.setShell);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
        {shellLabel[shell]}
        <ChevronDown size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={shell}
          onValueChange={(value) => setShell(value as ShellType)}
        >
          <DropdownMenuRadioItem value="cmd">Command Prompt</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="powershell">PowerShell</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bash">Git Bash</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
