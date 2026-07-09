"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetListingDetailsModal } from "@/module/dashboard/marketplace/components/modals/asset-listing-details-modal";
import { useMarketplaceListingsContext } from "@/module/dashboard/marketplace/context";
import { LISTING_STATUS_CONFIG, resolveAssetClassName, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { MarketplaceListingStatus, MarketplaceListingType } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type LuxfiListingRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  assetClass: string;
  stockQty: number;
  marketPrice: number;
  listingPrice: number;
  listingDate: string;
  status: MarketplaceListingStatus;
};

const PAGE_SIZE = 10;

function createAmountColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <span>{formatCurrency(Number(getValue()))}</span>,
  };
}

function formatDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function matchesQuery(listing: MarketplaceListingType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const assetItem = resolveAssetItemById(listing.assetItemId);
  return (
    listing.assetItemId.toLowerCase().includes(normalized) ||
    Boolean(assetItem?.name.toLowerCase().includes(normalized))
  );
}

export function LuxfiListingTab() {
  const { listings, updateListing, removeListing } = useMarketplaceListingsContext();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeListing, setActiveListing] = React.useState<MarketplaceListingType | null>(null);

  const filtered = React.useMemo(
    () => listings.filter((listing) => matchesQuery(listing, value.q ?? "")),
    [listings, value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: LuxfiListingRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((listing) => {
      const assetItem = resolveAssetItemById(listing.assetItemId);

      return {
        id: listing.listingId,
        assetId: listing.assetItemId,
        assetName: assetItem?.name ?? "-",
        assetClass: resolveAssetClassName(listing.assetClassId),
        stockQty: listing.totalAvailableQuantity,
        marketPrice: assetItem?.estimatedValue ?? 0,
        listingPrice: listing.listingPrice,
        listingDate: formatDateLabel(listing.listedAt),
        status: listing.listingStatus,
      };
    });
  }, [currentPage, filtered]);

  const columns: ColumnDef<LuxfiListingRow, unknown>[] = [
    createIdentifierColumn<LuxfiListingRow>("Asset ID", "assetId"),
    createTextColumn<LuxfiListingRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<LuxfiListingRow>("Class", "assetClass"),
    createTextColumn<LuxfiListingRow>("Stock QTY", "stockQty"),
    createAmountColumn<LuxfiListingRow>("Market Price", "marketPrice"),
    createAmountColumn<LuxfiListingRow>("Listing Price", "listingPrice"),
    createTextColumn<LuxfiListingRow>("Listing Date", "listingDate"),
    createStatusColumn<LuxfiListingRow, MarketplaceListingStatus>("Listing Status", LISTING_STATUS_CONFIG),
    createActionColumnWithOptions<LuxfiListingRow>({
      ariaLabel: "View listing details",
      onView: (row) => {
        const listing = listings.find((candidate) => candidate.listingId === row.id);
        if (listing) setActiveListing(listing);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No listings found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeListing ? (
        <AssetListingDetailsModal
          open={Boolean(activeListing)}
          onOpenChange={(open) => {
            if (!open) setActiveListing(null);
          }}
          listing={activeListing}
          onListingUpdated={(listingId, patch) => {
            updateListing(listingId, patch);
            setActiveListing((previous) => (previous ? { ...previous, ...patch } : previous));
          }}
          onListingDeleted={(listingId) => {
            removeListing(listingId);
            setActiveListing(null);
          }}
        />
      ) : null}
    </>
  );
}
