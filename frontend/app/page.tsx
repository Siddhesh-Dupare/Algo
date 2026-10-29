
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";

export default function App() {
  return (
    <div className="flex justify-center items-center">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultValue="40%">
          <div className="flex justify-center items-center min-h-screen">
            <Label>Upload</Label>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="60%">
          <div className="flex justify-center items-center min-h-screen">
            <Label>Visualization will come here</Label>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
