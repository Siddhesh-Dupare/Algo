import FileTree from "./FileTree";

export default function Sidebar() {
  return (
    <div className="h-full border-r border-border bg-muted/30">
      <FileTree />
    </div>
  );
}
