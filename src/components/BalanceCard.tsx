import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  label: string;
  amount: string;
  showButton?: boolean;
}

export function BalanceCard({ label, amount, showButton }: BalanceCardProps) {
  return (
    <div className="flex items-center gap-11 md:gap-16">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">
          {label}
        </p>
        <p className="text-4xl font-bold tracking-tight">{amount}</p>
      </div>
      {showButton && <Button className="rounded-full px-8">Withdraw</Button>}
    </div>
  );
}
