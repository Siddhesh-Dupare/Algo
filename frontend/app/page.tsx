import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";
import ThemeCommand from "@/components/theme/ThemeCommand";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <ThemeCommand />
      <MenuBar />
      <div className="flex-1">
        <MonacoEditor />
      </div>
    </div>
  );
}
