import { BASEURL } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface Transaction {
  amount: number;
  metadata: {
    name: string;
    type: string;
    email: string;
    quantity: number;
    country: string;
    product_name: string;
  };
  payment_reference: string;
  status: "successful" | "pending" | "failed";
  type:
    | "deposit"
    | "withdrawal"
    | "store"
    | "tipped"
    | "withdrawals"
    | "chargebacks"
    | "cashback"
    | "refer_earn";
  date: string;
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchTransactions(filters: TransactionFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const url = `${BASEURL}/transactions${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
}

export function useFetchTransactions(filters: TransactionFilters = {}) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    placeholderData: (previousData) => previousData, // Keep showing previous data
    staleTime: 1000 * 60 * 1, // Consider data fresh for 1 minute
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
