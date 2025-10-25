import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { useFetchTransactions } from "../use-fetch-transactions";

function TestComponent({ filters = {} }: { filters?: Record<string, string> }) {
  const { data, isLoading, isError, refetch, isFetching } =
    useFetchTransactions(filters as any);

  return (
    <div>
      {isLoading && <div>loading</div>}
      {isError && <div>error</div>}
      {isFetching && <div>fetching</div>}
      {data && <div>count: {data.length}</div>}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  );
}

describe("useFetchTransactions integration", () => {
  it("fetches transactions and updates on refetch", async () => {
    const tx1 = {
      amount: 100,
      metadata: {
        name: "Alice",
        type: "",
        email: "",
        quantity: 1,
        country: "",
        product_name: "Widget",
      },
      payment_reference: "r1",
      status: "successful",
      type: "deposit",
      date: new Date().toISOString(),
    } as any;

    const tx2 = {
      ...tx1,
      payment_reference: "r2",
      amount: 200,
    } as any;

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [tx1] })
      .mockResolvedValueOnce({ ok: true, json: async () => [tx1, tx2] });

    vi.stubGlobal("fetch", fetchMock);

    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={qc}>
        <TestComponent />
      </QueryClientProvider>
    );

    // initially loading
    expect(screen.getByText(/loading/i)).toBeTruthy();

    // wait for first fetch to finish and render count: 1
    await waitFor(() => expect(screen.getByText(/count:/i)).toBeTruthy());
    expect(screen.getByText("count: 1")).toBeTruthy();

    // click refetch which will trigger the second mocked response
    fireEvent.click(screen.getByRole("button", { name: /refetch/i }));

    // wait for count to update to 2
    await waitFor(() => expect(screen.getByText("count: 2")).toBeTruthy());

    // ensure fetch was called twice
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
