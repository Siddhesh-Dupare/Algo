
import LeftComponent from "./left/LeftComponent";

export default function StatusBar() {
  return (
    <div className="flex h-9 items-center justify-between">
      <div className="flex items-center gap-2">
        <LeftComponent />
      </div>
    </div>
  );
}
