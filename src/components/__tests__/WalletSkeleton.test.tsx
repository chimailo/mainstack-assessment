import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WalletSkeleton from "../WalletSkeleton";

describe("WalletSkeleton", () => {
  it("renders skeleton blocks for wallet layout", () => {
    const { container } = render(<WalletSkeleton />);
    // skeleton elements use the animate-pulse class from Skeleton
    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
  });
});
