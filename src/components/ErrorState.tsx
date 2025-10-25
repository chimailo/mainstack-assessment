import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Something went wrong</h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {message || "We couldn't load your transactions. Please try again."}
      </p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
