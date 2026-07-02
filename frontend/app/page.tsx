import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";
import ThemeCommand from "@/components/theme/ThemeCommand";
import Sidebar from "@/components/explorer/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <ThemeCommand />
      <MenuBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MonacoEditor />
        </div>
      </div>
    </div>
  );
}
