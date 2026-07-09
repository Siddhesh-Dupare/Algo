"use client";

import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";
import ThemeCommand from "@/components/command/ThemeCommand";
import Sidebar from "@/components/explorer/Sidebar";
import CommandPalette from "@/components/command/CommandPalette";
import StatusBar from "@/components/status-bar/StatusBar";
import { useUiStore } from "@/store/ui.store";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen flex-col">
      <ThemeCommand />
      <CommandPalette />
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
            <MonacoEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusBar />
    </div>
  );
}
