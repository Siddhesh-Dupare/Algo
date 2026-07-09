
import { Button } from "../ui/button";

import { executionData } from "./execution.data";

export default function ExecutionButtons() {
  return <div>
    {executionData.map((exe, index) => (
      <Button key={index} aria-label={exe.trigger}
        className="cursor-pointer"
        size="icon-sm"
        variant="ghost">
        <exe.icon size={15} />
      </Button>
    ))}
  </div>
}
