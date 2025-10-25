import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BalanceCard } from "../BalanceCard";

describe("BalanceCard", () => {
  it("renders and matches snapshot", () => {
    const { container } = render(
      <BalanceCard label="Available" amount="$1,234.56" showButton />
    );

    expect(container).toMatchSnapshot();
  });
});
