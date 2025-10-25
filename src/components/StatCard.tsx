import { Info } from "lucide-react";

interface StatCardProps {
  label: string;
  amount: string;
}

export function StatCard({ label, amount }: StatCardProps) {
  return (
    <div className="flex items-start justify-between py-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2 font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold tracking-tight">{amount}</p>
      </div>
      <Info className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
