import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";

export function TransactionListSkeleton() {
  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2 rounded-full" disabled>
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="secondary" className="gap-2 rounded-full" disabled>
            Export list
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b py-4 last:border-0"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-4 w-24" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="mt-1 h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
