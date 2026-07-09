import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getPythonPath(): Promise<string | undefined> {
  try {
    // NOTE: Search for the Python executable in the system path (windows)
    const { stdout } = await execAsync("where python");
    const paths = stdout.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
    return paths.length > 0 ? paths[0] : undefined;
  } catch (error) {
    console.error("Could not find Python path: ", error);
    return undefined;
  }
}
