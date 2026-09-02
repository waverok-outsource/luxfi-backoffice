"use client";

import * as React from "react";

import { AssetSearchPopover, AssetSearchResultRow } from "@/components/util/asset-search-popover";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAssets } from "@/services/queries/asset-management.queries";
import type { AssetItemType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";

type AssetSearchFieldProps = {
  onSelect: (assetItem: AssetItemType) => void;
};

/**
 * Searches the real Asset Management inventory (GET /v1/assets) — not the
 * external quick-search valuation lookup — so an admin can list an
 * already-registered asset on the marketplace.
 */
export function AssetSearchField({ onSelect }: AssetSearchFieldProps) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const isOpen = debouncedQuery.trim().length > 0;

  const { data: assetsResponse } = useAssets(
    convertObjectToQuery({ q: debouncedQuery }),
    isOpen,
  );
  const results = assetsResponse?.data ?? [];

  return (
    <AssetSearchPopover
      query={query}
      onQueryChange={setQuery}
      isOpen={isOpen}
      results={results}
      getResultKey={(item) => item.assetId}
      onSelect={onSelect}
      placeholder="Enter Asset ID or select asset"
      renderResult={(item, handleSelect) => (
        <AssetSearchResultRow
          name={item.name}
          primaryLine={formatCurrency(item.price.value, item.price.currencyCode)}
          badgeLabel={item.assetCategoryName}
          onSelect={handleSelect}
        />
      )}
    />
  );
}
