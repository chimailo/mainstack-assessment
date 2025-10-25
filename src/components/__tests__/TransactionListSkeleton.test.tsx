import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransactionListSkeleton } from "../TransactionListSkeleton";

describe("TransactionListSkeleton", () => {
  it("renders several placeholder rows", () => {
    const { container } = render(<TransactionListSkeleton />);
    const rows = container.querySelectorAll(".py-4");
    // Expect at least a few placeholder rows
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });
});
