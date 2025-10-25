import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "../StatCard";

describe("StatCard", () => {
  it("renders and matches snapshot", () => {
    const { container } = render(
      <StatCard label="Total sales" amount="$12,345" />
    );

    expect(container).toMatchSnapshot();
  });
});
