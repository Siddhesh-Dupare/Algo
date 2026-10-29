
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CloudUpload } from "lucide-react";

export default function UploadCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Choose a written code file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-primary rounded-sm p-2 flex justify-center items-center flex-col min-h-32 cursor-pointer">
          <CloudUpload className="cursor-pointer"/>
          <Label className="cursor-pointer">Click to browse</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <Button variant="outline" className="bg-primary-foreground">
          Upload
        </Button>
      </CardFooter>
    </Card>
  );
}
