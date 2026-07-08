import { create } from "zustand";
import type { editor } from "monaco-editor";

interface EditorState {
  editor: editor.IStandaloneCodeEditor | null;
  setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
  undo: () => void;
  redo: () => void;
  cut: () => void;
  copy: () => void;
  paste: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
  undo: () => get().editor?.trigger("menu", "undo", null),
  redo: () => get().editor?.trigger("menu", "redo", null),
  cut: () => {
    const editor = get().editor;
    editor?.focus();
    editor?.trigger("menu", "editor.action.clipboardCutAction", null);
  },
  copy: () => {
    const editor = get().editor;
    editor?.focus();
    editor?.trigger("menu", "editor.action.clipboardCopyAction", null);
  },
  paste: () => {
    const editor = get().editor;
    editor?.focus();
    editor?.trigger("menu", "editor.action.clipboardPasteAction", null);
  },
}));
