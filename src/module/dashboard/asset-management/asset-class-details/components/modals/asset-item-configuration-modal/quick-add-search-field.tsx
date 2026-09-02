"use client";

import * as React from "react";

import { AssetSearchPopover, AssetSearchResultRow } from "@/components/util/asset-search-popover";
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
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: quickSearchResponse } = useAssetQuickSearch(debouncedQuery, VALUATOR_NAME, 1);
  const results = quickSearchResponse?.data.assets ?? [];
  const isOpen = debouncedQuery.trim().length > 0;

  return (
    <AssetSearchPopover
      query={query}
      onQueryChange={setQuery}
      isOpen={isOpen}
      results={results}
      getResultKey={(result) => result.id}
      onSelect={onSelect}
      placeholder="Search by Name or ref ID from API"
      renderResult={(result, handleSelect) => (
        <AssetSearchResultRow
          name={result.name}
          primaryLine={`Retail ${result.retail_price}`}
          badgeLabel={`Market ${result.market_price}`}
          onSelect={handleSelect}
        />
      )}
    />
  );
}
