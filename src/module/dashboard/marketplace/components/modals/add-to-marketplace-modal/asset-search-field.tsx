"use client";

import * as React from "react";
import { Plus, Search, Watch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAllAssetItems, resolveAssetClassName } from "@/module/dashboard/marketplace/data";
import type { AssetItemType } from "@/types/asset-management.type";
import { formatCurrency } from "@/util/format-currency";

function filterAssetItems(query: string): AssetItemType[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return getAllAssetItems().filter((item) =>
    [item.name, item.assetId].some((field) => field.toLowerCase().includes(normalized)),
  );
}

type AssetSearchFieldProps = {
  onSelect: (assetItem: AssetItemType) => void;
};

/**
 * Searches existing Asset Management inventory (not an external catalog) so an
 * admin can list an already-registered asset item on the marketplace.
 */
export function AssetSearchField({ onSelect }: AssetSearchFieldProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = React.useMemo(() => filterAssetItems(debouncedQuery), [debouncedQuery]);
  const isOpen = debouncedQuery.trim().length > 0;

  const handleSelect = (assetItem: AssetItemType) => {
    onSelect(assetItem);
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
              placeholder="Enter Asset ID or select asset"
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
            {results.map((item) => (
              <li
                key={item.assetId}
                className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-primary-grey-undertone"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-grey-undertone text-text-grey">
                    <Watch className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-black">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-text-grey">
                      <span>{formatCurrency(item.price.value, item.price.currencyCode)}</span>
                      <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
                        {resolveAssetClassName(item.assetClassId)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  className="shrink-0 rounded-full"
                  onClick={() => handleSelect(item)}
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
