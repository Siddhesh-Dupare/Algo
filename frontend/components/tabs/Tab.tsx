
import Tabs from "./Tabs";
import ExecutionButtons from "./ExecutionButtons";

import { Separator } from "../ui/separator";

export default function Tab() {
  return (
    <div className="flex justify-between items-center">
      <Tabs />
      <Separator orientation="vertical" />
      <ExecutionButtons />
    </div>
  );
}
