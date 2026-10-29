
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { CloudUpload } from "lucide-react";

export default function UploadCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Choose a written code file</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <label
          htmlFor="file-upload"
          className="mx-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-primary bg-secondary p-4 text-center"
        >
          <CloudUpload className="mb-2 size-8" aria-hidden="true" />
          <span>Click to browse</span>
          <input id="file-upload" type="file" className="sr-only" />
        </label>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <Button variant="outline" className="bg-primary-foreground cursor-pointer">
          Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
