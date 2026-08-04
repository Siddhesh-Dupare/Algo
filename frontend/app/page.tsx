
import MenuBar from "@/components/menubar/MenuBar";
import StatusBar from "@/components/statusbar/StatusBar";
import MonacoEditor from "@/components/editor/MonacoEditor";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <MenuBar />
      <div className="flex-1">
        <MonacoEditor />
      </div>
      <StatusBar />
    </div>
  );
}
