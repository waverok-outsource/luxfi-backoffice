"use client";

import * as React from "react";
import { Plus, Search, Watch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mockWatchChartsSearchResults } from "@/module/dashboard/asset-management/data";
import type { WatchChartsSearchResultType } from "@/types/asset-management.type";

function filterResults(query: string): WatchChartsSearchResultType[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return mockWatchChartsSearchResults.filter((result) =>
    [result.name, result.brand, result.referenceNumber].some((field) =>
      field.toLowerCase().includes(normalized),
    ),
  );
}

type QuickAddSearchFieldProps = {
  onSelect: (result: WatchChartsSearchResultType) => void;
};

/**
 * Search-as-you-type against the (future) WatchCharts API integration. Renders
 * results in an interactive popover so an admin can Quick Add without typing
 * every field manually.
 */
export function QuickAddSearchField({ onSelect }: QuickAddSearchFieldProps) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = React.useMemo(() => filterResults(debouncedQuery), [debouncedQuery]);
  const isOpen = debouncedQuery.trim().length > 0;

  const handleSelect = (result: WatchChartsSearchResultType) => {
    onSelect(result);
    setQuery("");
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => (!open ? setQuery("") : undefined)}>
      <PopoverTrigger
        render={
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-grey" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by Name or ref ID from API"
              className="form-control-base form-control-focus h-12 w-full rounded-full border border-primary-grey-stroke bg-primary-white pl-11 pr-4 text-sm"
            />
          </div>
        }
      />

      <PopoverContent align="start" sideOffset={8} className="max-h-80 w-[420px] max-w-[90vw] overflow-y-auto p-2">
        {results.length ? (
          <ul className="flex flex-col gap-1">
            {results.map((result) => (
              <li
                key={result.id}
                className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-primary-grey-undertone"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-grey-undertone text-text-grey">
                    <Watch className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-black">{result.name}</p>
                    <div className="flex items-center gap-2 text-xs text-text-grey">
                      <span>${result.price.toLocaleString()}</span>
                      <span className="text-alert-error">-{result.discountPercent}%</span>
                      <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
                        Market Price
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  className="shrink-0 rounded-full"
                  onClick={() => handleSelect(result)}
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3 text-center text-sm text-text-grey">No results found</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
