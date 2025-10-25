import { ErrorBoundary } from "./ErrorBoundary";
import { TransactionList as TransactionListContent } from "./TransactionList";

export function TransactionListWithErrorBoundary() {
  return (
    <ErrorBoundary
      onReset={() => {
        // You might want to clear filters or do other cleanup here
        window.location.href = "/";
      }}
    >
      <TransactionListContent />
    </ErrorBoundary>
  );
}
