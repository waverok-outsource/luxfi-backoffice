"use client";

import * as React from "react";
import { Plus, Search, Watch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAssetQuickSearch } from "@/services/queries/asset-management.queries";
import type { AssetQuickSearchResultType } from "@/types/asset-management.type";

// Hardcoded since the sample response only ever showed one provider ("parse").
// See docs/STATUS.md for whether this should
// become user-selectable if more providers are added.
const VALUATOR_NAME = "parse";

type QuickAddSearchFieldProps = {
  onSelect: (result: AssetQuickSearchResultType) => void;
};

/**
 * Search-as-you-type against the real quick-search valuation lookup. Renders
 * results in an interactive popover so an admin can Quick Add without typing
 * every field manually.
 *
 * The response only carries id/slug/name/prices/url — no brand, year, case,
 * weight, or dial colour — so selecting a result only autofills the item
 * name; see ADR 0003 for the backend follow-up on richer autofill data.
 */
export function QuickAddSearchField({ onSelect }: QuickAddSearchFieldProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: quickSearchResponse } = useAssetQuickSearch(debouncedQuery, VALUATOR_NAME, 1);
  const results = quickSearchResponse?.data.assets ?? [];
  const isOpen = debouncedQuery.trim().length > 0;

  const handleSelect = (result: AssetQuickSearchResultType) => {
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
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by Name or ref ID from API"
              className="form-control-base form-control-focus h-12 w-full rounded-full border border-primary-grey-stroke bg-primary-white pl-11 pr-4 text-sm text-text-black"
            />
          </div>
        }
      />

      <PopoverContent
        align="start"
        sideOffset={8}
        initialFocus={false}
        finalFocus={inputRef}
        className="max-h-80 w-[420px] max-w-[90vw] overflow-y-auto p-2"
      >
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
                      <span>Retail {result.retail_price}</span>
                      <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
                        Market {result.market_price}
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
