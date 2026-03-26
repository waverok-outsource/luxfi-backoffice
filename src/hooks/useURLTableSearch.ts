"use client";

import * as React from "react";

import { useURLQuery } from "@/hooks/useUrlQuery";

type TableSearchQuery = Record<string, string | undefined>;

export function useURLTableSearch(queryKey: string = "search") {
  const { value, setURLQuery } = useURLQuery<TableSearchQuery>();
  const searchValue = value[queryKey];
  const search = typeof searchValue === "string" ? searchValue : "";

  const setSearch = React.useCallback(
    (nextSearch: string) => {
      const normalizedSearch = nextSearch.trim();

      setURLQuery({
        [queryKey]: normalizedSearch || undefined,
        page: "1",
      });
    },
    [queryKey, setURLQuery],
  );

  return {
    search,
    setSearch,
  };
}
