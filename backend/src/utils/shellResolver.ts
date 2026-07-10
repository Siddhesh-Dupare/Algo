import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import path from "path";

const execAsync = promisify(exec);

export type ShellType = "cmd" | "powershell" | "bash";

async function whereFirst(cmd: string): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync(`where ${cmd}`);
    const paths = stdout.split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
    return paths[0];
  } catch {
    return undefined;
  }
}

export async function resolveShellPath(shell: ShellType): Promise<string | undefined> {
  switch (shell) {
    case "cmd": {
      const fixed = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd.exe");
      return existsSync(fixed) ? fixed : await whereFirst("cmd.exe");
    }
    case "powershell": {
      const fixed = path.join(
        process.env.SystemRoot ?? "C:\\Windows",
        "System32",
        "WindowsPowerShell",
        "v1.0",
        "powershell.exe",
      );
      return existsSync(fixed) ? fixed : await whereFirst("powershell.exe");
    }
    case "bash": {
      const found = await whereFirst("bash.exe");
      if (found) return found;
      const fallback = "C:\\Program Files\\Git\\bin\\bash.exe";
      return existsSync(fallback) ? fallback : undefined;
    }
  }
}
