import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EmptyAlert() {
  return (
    <Alert className="mt-14 w-full">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Oops</AlertTitle>
      <AlertDescription>
        The post/photo you are looking for does not exist.
      </AlertDescription>
    </Alert>
  );
}
