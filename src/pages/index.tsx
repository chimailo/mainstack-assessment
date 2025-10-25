import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/Sidebar";
import { BalanceCard } from "@/components/BalanceCard";
import { StatCard } from "@/components/StatCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorState } from "@/components/ErrorState";
import { RevenueChart } from "@/components/RevenueChart";
import { TransactionList } from "@/components/TransactionList";
import { useFetchWallet } from "@/hooks/use-fetch-wallet";
import { formatToCurrency } from "@/lib/utils";
import { WalletSkeleton } from "@/components/WalletSkeleton";

const Index = () => {
  const { data: wallet, isLoading, isError, error, refetch } = useFetchWallet();

  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      <Navigation />
      <Sidebar />

      <main className="w-full max-w-[1160px] mx-auto">
        <div className="md:flex md:gap-12 lg:gap-28 my-16">
          <ErrorBoundary onReset={() => refetch()}>
            {isLoading ? (
              <WalletSkeleton />
            ) : isError ? (
              <div className="w-full min-h-64 grid place-items-center items-center justify-center bg-background">
                <ErrorState
                  message={
                    error instanceof Error
                      ? error.message
                      : "Failed to load wallet"
                  }
                  onRetry={() => refetch()}
                />
              </div>
            ) : (
              <>
                {/* Top Section: Balance and Stats */}
                {/* Left: Available Balance */}
                <div className="flex-1 space-y-10 md:space-y-16">
                  <BalanceCard
                    label="Available Balance"
                    amount={formatToCurrency(wallet?.balance)}
                    showButton
                  />
                  {/* Chart Section */}
                  <RevenueChart />
                </div>

                {/* Right: Stats */}
                <div className="space-y-0 md:w-[270px] w-full">
                  <StatCard
                    label="Ledger Balance"
                    amount={formatToCurrency(wallet?.ledger_balance)}
                  />
                  <StatCard
                    label="Total Payout"
                    amount={formatToCurrency(wallet?.total_payout)}
                  />
                  <StatCard
                    label="Total Revenue"
                    amount={formatToCurrency(wallet?.total_revenue)}
                  />
                  <StatCard
                    label="Pending Payout"
                    amount={formatToCurrency(wallet?.pending_payout)}
                  />
                </div>
              </>
            )}
          </ErrorBoundary>
        </div>
        {/* Transactions Section */}
        <TransactionList />
      </main>
    </div>
  );
};

export default Index;
