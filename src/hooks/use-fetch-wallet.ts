import { BASEURL } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export type Wallet = {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  ledger_balance: number;
};

async function fetchWallet() {
  const wallet = await fetch(`${BASEURL}/wallet`);
  return wallet.json();
}

export function useFetchWallet() {
  return useQuery<Wallet>({
    queryKey: [`wallet`],
    queryFn: () => fetchWallet(),
  });
}
