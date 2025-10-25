import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import { TransactionListSkeleton } from "./TransactionListSkeleton";
import { ErrorState } from "./ErrorState";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { describeDateRange, formatToCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useSetFilters } from "@/hooks/use-search-param";

export function TransactionList() {
  const [filterOpen, setFilterOpen] = useState(false);

  const { getFilters, setFilters } = useSetFilters();

  const { appliedFilters, appliedFiltersCount, hasActiveFilters } =
    getFilters();

  const {
    data: transactions,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useFetchTransactions(appliedFilters);

  const startDate = appliedFilters.startDate
    ? new Date(appliedFilters.startDate)
    : undefined;
  const endDate = appliedFilters.endDate
    ? new Date(appliedFilters.endDate)
    : undefined;

  const handleClearFilter = () => {
    setFilters({ type: null, status: null, startDate: null, endDate: null });
  };

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {transactions?.length || 0} Transactions
            {isFetching && (
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Your transactions for{" "}
            {hasActiveFilters
              ? describeDateRange(startDate, endDate)
              : "all time"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 rounded-full"
            onClick={() => setFilterOpen(true)}
          >
            Filter
            {hasActiveFilters && (
              <>
                <span className="font-medium text-sm size-5 bg-primary flex items-center justify-center">
                  {appliedFiltersCount}
                </span>
              </>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" className="gap-2 rounded-full">
            Export list
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FilterDrawer open={filterOpen} onOpenChange={setFilterOpen} />

      {isError ? (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Failed to load transactions"
          }
          onRetry={refetch}
        />
      ) : transactions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">
            No matching transaction found for the selected filter
          </h3>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Change your filters to see more results, or add a new product.
          </p>
          <Button variant="secondary" onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>
      ) : (
        <div className="space-y-0">
          {(transactions || []).map((transaction) => (
            <div
              key={transaction.payment_reference}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    transaction.status === "successful"
                      ? "bg-[#E3FCF2]"
                      : transaction.status === "pending"
                      ? "bg-orange-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.status === "successful" ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.metadata?.product_name || "N/A"}
                  </p>
                  {transaction.metadata?.name ? (
                    <p className="text-sm text-gray-500 font-medium">
                      {transaction.metadata?.name}
                    </p>
                  ) : transaction.status ? (
                    <>
                      <p
                        className={`text-sm capitalize ${
                          transaction.status === "successful"
                            ? "text-green-600"
                            : transaction.status === "pending"
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {transaction.status}
                      </p>
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatToCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date
                    ? format(new Date(transaction.date), "MMM dd, yyyy")
                    : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
