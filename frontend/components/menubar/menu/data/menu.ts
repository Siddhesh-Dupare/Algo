
import { useEditorStore } from "@/store/editorstore";
import { runActiveFile } from "@/lib/RunFile";

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
  // NOTE: AlgoLens menu
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
      }
    ]
  },
  // NOTE: File menu
  {
    id: "file",
    trigger: "File",
    items: [
      {
        id: "new-file",
        type: "item",
        label: "New File",
        shortcut: "CTRN+N",
      },
      {
        id: "open-file",
        type: "item",
        label: "Open File…",
        shortcut: "Ctrl+O",
      },
      {
        id: "open-folder",
        type: "item",
        label: "Open Folder…",
        shortcut: "Ctrl+K Ctrl+O",
      },
      { type: "separator" },
      {
        id: "save",
        type: "item",
        label: "Save",
        shortcut: "Ctrl+S",
      },
      {
        id: "save-as",
        type: "item",
        label: "Save As…",
        shortcut: "Ctrl+Shift+S",
      },
      {
        id: "save-all",
        type: "item",
        label: "Save All",
        shortcut: "Ctrl+K S",
      },
    ]
  },
  {
    id: "run",
    trigger: "Run",
    items: [
      {
        id: "run",
        type: "item",
        label: "Run",
        shortcut: "CTRL+R",
        action: () => runActiveFile(),
      }
    ]
  }
]
