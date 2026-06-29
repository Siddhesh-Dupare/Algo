import MenuBar from "@/components/menubar/MenuBar";
import MonacoEditor from "@/components/editor/Monaco";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <MenuBar />
      <div className="flex-1">
        <MonacoEditor />
      </div>
    </div>
  );
}
