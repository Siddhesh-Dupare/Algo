import { useFileStore } from "@/store/file.store";
import { useThemeStore } from "@/store/theme.store";
import { useFolderStore } from "@/store/folder.store";
import { useUiStore } from "@/store/ui.store";
import { useCommandStore } from "@/store/command.store";
import { useEditorStore } from "@/store/editor.store";
import { runActiveFilePython } from "@/lib/runPython";

export type MenubarItemConfig = {
  id?: string;
  type?: "item" | "separator";
  label?: string;
  shortcut?: string;
  action?: () => void;
};

export interface MenuConfig {
  id: string;
  trigger: string;
  items: MenubarItemConfig[];
}

export const menuConfig: MenuConfig[] = [
  {
    id: "algolens",
    trigger: "AlgoLens",
    items: [
      {
        id: "settings",
        type: "item",
        label: "Settings...",
      },
      { type: "separator" },
      {
        id: "theme",
        type: "item",
        label: "Set theme...",
        action: () => useThemeStore.getState().setDialogOpen(true),
      },
    ],
  },
  {
    id: "file",
    trigger: "File",
    items: [
      {
        id: "new-file",
        type: "item",
        label: "New File",
        shortcut: "Ctrl+N",
        action: () => useFileStore.getState().newFile(),
      },
      {
        id: "open-file",
        type: "item",
        label: "Open File…",
        shortcut: "Ctrl+O",
        action: () => useFileStore.getState().openFile(),
      },
      {
        id: "open-folder",
        type: "item",
        label: "Open Folder…",
        shortcut: "Ctrl+K Ctrl+O",
        action: () => useFolderStore.getState().openFolder(),
      },
      { type: "separator" },
      {
        id: "save",
        type: "item",
        label: "Save",
        shortcut: "Ctrl+S",
        action: () => {
          const { activeFileId, saveFile } = useFileStore.getState();
          if (activeFileId) saveFile(activeFileId);
        },
      },
      {
        id: "save-as",
        type: "item",
        label: "Save As…",
        shortcut: "Ctrl+Shift+S",
        action: () => {
          const { activeFileId, saveFileAs } = useFileStore.getState();
          if (activeFileId) saveFileAs(activeFileId);
        },
      },
      {
        id: "save-all",
        type: "item",
        label: "Save All",
        shortcut: "Ctrl+K S",
        action: () => useFileStore.getState().saveAllFiles(),
      },
      { type: "separator" },
      {
        id: "close-editor",
        type: "item",
        label: "Close Editor",
        shortcut: "Ctrl+W",
      },
      { type: "separator" },
      { id: "exit", type: "item", label: "Exit", shortcut: "Ctrl+Q" },
    ],
  },
  {
    id: "edit",
    trigger: "Edit",
    items: [
      {
        id: "undo",
        type: "item",
        label: "Undo",
        shortcut: "Ctrl+Z",
        action: () => useEditorStore.getState().undo(),
      },
      {
        id: "redo",
        type: "item",
        label: "Redo",
        shortcut: "Ctrl+Y",
        action: () => useEditorStore.getState().redo(),
      },
      { type: "separator" },
      {
        id: "cut",
        type: "item",
        label: "Cut",
        shortcut: "Ctrl+X",
        action: () => useEditorStore.getState().cut(),
      },
      {
        id: "copy",
        type: "item",
        label: "Copy",
        shortcut: "Ctrl+C",
        action: () => useEditorStore.getState().copy(),
      },
      {
        id: "paste",
        type: "item",
        label: "Paste",
        shortcut: "Ctrl+V",
        action: () => useEditorStore.getState().paste(),
      },
      { type: "separator" },
      {
        id: "find",
        type: "item",
        label: "Find",
        shortcut: "Ctrl+F",
      },
      {
        id: "replace",
        type: "item",
        label: "Replace",
        shortcut: "Ctrl+H",
      },
    ],
  },
  {
    id: "selection",
    trigger: "Selection",
    items: [
      {
        id: "select-all",
        type: "item",
        label: "Select All",
        shortcut: "Ctrl+A",
      },
      {
        id: "expand-selection",
        type: "item",
        label: "Expand Selection",
        shortcut: "Shift+Alt+→",
      },
      {
        id: "shrink-selection",
        type: "item",
        label: "Shrink Selection",
        shortcut: "Shift+Alt+←",
      },
      { type: "separator" },
      {
        id: "copy-line-up",
        type: "item",
        label: "Copy Line Up",
        shortcut: "Shift+Alt+↑",
      },
      {
        id: "copy-line-down",
        type: "item",
        label: "Copy Line Down",
        shortcut: "Shift+Alt+↓",
      },
    ],
  },
  {
    id: "trigger",
    trigger: "View",
    items: [
      {
        id: "command-palette",
        type: "item",
        label: "Command Palette…",
        shortcut: "Ctrl+Shift+P",
        action: () => useCommandStore.getState().setDialogOpen(true),
      },
      { type: "separator" },
      { id: "zoom-in", type: "item", label: "Zoom In", shortcut: "Ctrl+=" },
      { id: "zoom-out", type: "item", label: "Zoom Out", shortcut: "Ctrl+-" },
      {
        id: "reset-zoom",
        type: "item",
        label: "Reset Zoom",
        shortcut: "Ctrl+0",
      },
      { type: "separator" },
      {
        id: "project-panel",
        type: "item",
        label: "Project Panel",
        action: () => useUiStore.getState().toggleSidebar(),
      },
      {
        id: "terminal-panel",
        type: "item",
        label: "Terminal Panel",
        action: () => useUiStore.getState().toggleTerminal(),
      },
      {
        id: "visualizer-panel",
        type: "item",
        label: "Visualizer Panel",
      },
    ],
  },
  {
    id: "run",
    trigger: "Run",
    items: [
      {
        id: "run",
        type: "item",
        label: "Run Program",
        shortcut: "F5",
        action: () => runActiveFilePython(),
      },
      {
        id: "debug",
        type: "item",
        label: "Debug Program",
        shortcut: "F9",
      },
    ],
  },
  {
    id: "help",
    trigger: "Help",
    items: [
      {
        id: "documentation",
        type: "item",
        label: "Documentation",
      },
      { type: "separator" },
      {
        id: "report-bug",
        type: "item",
        label: "Report Bug…",
      },
      {
        id: "request-feature",
        type: "item",
        label: "Request Feature…",
      },
      { type: "separator" },
      {
        id: "about",
        type: "item",
        label: "About AlgoLens",
      },
    ],
  },
];
