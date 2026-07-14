"use client";

import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";
import ThemeCommand from "@/components/command/ThemeCommand";
import Sidebar from "@/components/explorer/Sidebar";
import CommandPalette from "@/components/command/CommandPalette";
import StatusBar from "@/components/status-bar/StatusBar";
import TerminalPanel from "@/components/terminal/TerminalPanel";
import UnsavedChangesDialog from "@/components/dialogs/UnsavedChangesDialog";
import { useUiStore } from "@/store/ui.store";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const terminalOpen = useUiStore((s) => s.terminalOpen);

  return (
    <div className="flex h-screen flex-col">
      <ThemeCommand />
      <CommandPalette />
      <UnsavedChangesDialog />
      <MenuBar />
      <div className="flex min-h-0 flex-1">
        <ResizablePanelGroup orientation="horizontal">
          {sidebarOpen && (
            <>
              <ResizablePanel defaultSize="15">
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          <ResizablePanel minSize="30">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={terminalOpen ? "70" : "100"} minSize="20">
                <MonacoEditor />
              </ResizablePanel>
              {terminalOpen && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize="30" minSize="10">
                    <TerminalPanel />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusBar />
    </div>
  );
}
