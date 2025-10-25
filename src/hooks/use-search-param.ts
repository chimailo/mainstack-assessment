import { filterFalsyValues } from "@/lib/utils";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export interface SetSearchParamOptions {
  replace?: boolean;
}

export function useSetFilters() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const getFilters = useCallback(() => {
    const params = new URLSearchParams(search);
    const filters = {
      type: params.get("type") || undefined,
      status: params.get("status") || undefined,
      startDate: params.get("startDate") || undefined,
      endDate: params.get("endDate") || undefined,
    };

    const appliedFilters = filterFalsyValues(filters);
    const appliedFiltersCount = Object.keys(appliedFilters).length;
    const hasActiveFilters = appliedFiltersCount > 0;
    return { appliedFilters, appliedFiltersCount, hasActiveFilters };
  }, [search]);

  const setFilters = useCallback(
    (
      filters: Record<string, string | null | undefined>,
      { replace = false }: SetSearchParamOptions = {}
    ) => {
      const params = new URLSearchParams(search);
      console.log("Search", params);

      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      console.log("Modified Search", params);

      const searchString = params.toString();
      navigate(
        {
          pathname,
          search: searchString ? `?${searchString}` : "",
        },
        { replace }
      );
    },
    [navigate, pathname, search]
  );
  return { getFilters, setFilters };
}
