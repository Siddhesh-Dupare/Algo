import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";
import ThemeCommand from "@/components/theme/ThemeCommand";
import Sidebar from "@/components/explorer/Sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <ThemeCommand />
      <MenuBar />
      <div className="flex min-h-0 flex-1">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="15">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize="30">
            <MonacoEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
