import { useFileStore } from "@/store/file.store";

export interface LanguageInfo {
  id: string;
  label: string;
}

const PLAINTEXT: LanguageInfo = { id: "plain-text", label: "Plain Text" };

const EXTENSION_MAP: Record<string, LanguageInfo> = {
  py: { id: "python", label: "Python" },
  js: { id: "javascript", label: "JavaScript" },
  jsx: { id: "javascript", label: "JavaScript" },
  mjs: { id: "javascript", label: "JavaScript" },
  cjs: { id: "javascript", label: "JavaScript" },
  ts: { id: "typescript", label: "TypeScript" },
  tsx: { id: "typescript", label: "TypeScript" },
  c: { id: "c", label: "C" },
  h: { id: "c", label: "C" },
  cpp: { id: "cpp", label: "C++" },
  cc: { id: "cpp", label: "C++" },
  cxx: { id: "cpp", label: "C++" },
  hpp: { id: "cpp", label: "C++" },
};

export function getLanguageInfo(filename: string): LanguageInfo {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return PLAINTEXT;
  return EXTENSION_MAP[extension] ?? PLAINTEXT;
}

export function useActiveFileLanguage(): LanguageInfo {
  return useFileStore((s) => {
    const file = s.files.find((f) => f.id === s.activeFileId);
    return file ? getLanguageInfo(file.name) : PLAINTEXT;
  });
}
