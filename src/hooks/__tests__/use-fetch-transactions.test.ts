import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTransactions } from "../use-fetch-transactions";
import { BASEURL } from "@/constants";

describe("fetchTransactions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch with base url when no filters provided", async () => {
    const mockResponse: Array<Record<string, any>> = [
      { payment_reference: "r1" },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const data = await fetchTransactions({});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${BASEURL}/transactions`);
    expect(data).toEqual(mockResponse);
  });

  it("appends query params for provided filters and omits falsy/empty values", async () => {
    const mockResponse: Array<Record<string, any>> = [];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const filters = {
      status: "successful",
      type: "deposit",
      startDate: "",
      endDate: undefined,
    };
    const data = await fetchTransactions(filters as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledWith = (fetchMock as unknown as vi.Mock).mock
      .calls[0][0] as string;
    expect(calledWith).toContain("status=successful");
    expect(calledWith).toContain("type=deposit");
    expect(calledWith).not.toContain("startDate=");
    expect(data).toEqual(mockResponse);
  });

  it("throws when fetch response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(fetchTransactions({})).rejects.toThrow(
      "Failed to fetch transactions"
    );
  });
});
