import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useEffect } from "react";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: "/app",
    search: "?type=deposit&startDate=2025-10-01",
  }),
}));

import { useSetFilters } from "../use-search-param";

function TestComponent({ onReady }: { onReady: (api: any) => void }) {
  const { getFilters, setFilters } = useSetFilters();
  useEffect(() => {
    onReady({ getFilters, setFilters });
  }, [getFilters, setFilters, onReady]);
  return null;
}

describe("useSetFilters", () => {
  it("parses filters from location.search and setFilters calls navigate correctly", () => {
    let api: any;
    render(<TestComponent onReady={(a) => (api = a)} />);

    const { appliedFilters, appliedFiltersCount, hasActiveFilters } =
      api.getFilters();
    expect(appliedFilters.type).toBe("deposit");
    expect(appliedFilters.startDate).toBe("2025-10-01");
    expect(appliedFiltersCount).toBe(2);
    expect(hasActiveFilters).toBe(true);

    api.setFilters({ type: null, status: "pending" });
    // setFilters keeps other existing params (e.g. startDate) unless removed.
    expect(mockNavigate).toHaveBeenCalledWith(
      { pathname: "/app", search: "?startDate=2025-10-01&status=pending" },
      { replace: false }
    );
  });
});
