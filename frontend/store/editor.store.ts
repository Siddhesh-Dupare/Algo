import { create } from "zustand";
import type { editor } from "monaco-editor";

interface EditorState {
  editor: editor.IStandaloneCodeEditor | null;
  setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
  undo: () => get().editor?.trigger("menu", "undo", null),
  redo: () => get().editor?.trigger("menu", "redo", null),
}));
