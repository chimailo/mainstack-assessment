import { Skeleton } from "@/components/ui/skeleton";

export function WalletSkeleton() {
  return (
    <main className="w-full max-w-[1160px] mx-auto">
      <div className="md:flex md:gap-12">
        {/* Left Column */}
        <div className="flex-1 space-y-10 md:space-y-16">
          <Skeleton className="mt-4 h-40 w-full rounded-lg" />

          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:w-[270px] w-full">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}

export default WalletSkeleton;
