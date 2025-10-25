import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// We'll mock the transaction hook and the search-param hook so we can drive
// the component through loading, error and empty states deterministically.
const mockFetch: any = {
  data: undefined,
  isLoading: true,
  isError: false,
  error: null,
  isFetching: false,
  refetch: vi.fn(),
};

const mockSetFiltersFn = vi.fn();

vi.mock("@/hooks/use-fetch-transactions", () => ({
  useFetchTransactions: () => mockFetch,
}));

vi.mock("@/hooks/use-search-param", () => ({
  useSetFilters: () => ({
    getFilters: () => ({
      appliedFilters: {},
      appliedFiltersCount: 0,
      hasActiveFilters: false,
    }),
    setFilters: mockSetFiltersFn,
  }),
}));

import { TransactionList } from "../TransactionList";

describe("TransactionList interactions", () => {
  beforeEach(() => {
    // reset to loading default before each test
    mockFetch.data = undefined;
    mockFetch.isLoading = true;
    mockFetch.isError = false;
    mockFetch.error = null;
    mockFetch.isFetching = false;
    mockFetch.refetch = vi.fn();
    mockSetFiltersFn.mockReset();
  });

  it("renders loading skeleton and matches snapshot", () => {
    mockFetch.isLoading = true;
    const { container } = render(<TransactionList />);
    expect(container).toMatchSnapshot();
  });

  it("renders error state and calls refetch when retry clicked", async () => {
    mockFetch.isLoading = false;
    mockFetch.isError = true;
    mockFetch.error = new Error("Network fail");
    const refetch = vi.fn();
    mockFetch.refetch = refetch;

    render(<TransactionList />);

    // ErrorState uses text 'Something went wrong' and 'Try again' button
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
    const btn = screen.getByRole("button", { name: /Try again/i });
    fireEvent.click(btn);
    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty state and clicking Clear Filter calls setFilters", () => {
    mockFetch.isLoading = false;
    mockFetch.isError = false;
    mockFetch.data = [];

    const { container } = render(<TransactionList />);

    expect(screen.getByText(/No matching transaction found/i)).toBeTruthy();

    const clear = screen.getByRole("button", { name: /Clear Filter/i });
    fireEvent.click(clear);
    expect(mockSetFiltersFn).toHaveBeenCalled();

    expect(container).toMatchSnapshot();
  });
});
