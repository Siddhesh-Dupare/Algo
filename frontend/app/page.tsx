
import MenuBar from "@/components/menubar/MenuBar";
import StatusBar from "@/components/statusbar/StatusBar";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <MenuBar />
      <div className="flex-1">

      </div>
      <StatusBar />
    </div>
  );
}
