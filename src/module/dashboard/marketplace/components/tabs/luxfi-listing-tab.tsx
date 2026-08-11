"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetListingDetailsModal } from "@/module/dashboard/marketplace/components/modals/asset-listing-details-modal";
import {
  createAmountColumn,
  formatTableDateLabel,
} from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { ASSET_MARKET_LISTING_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import { useAssetMarketListings } from "@/services/queries/marketplace.queries";
import type { AssetMarketListingStatus, AssetMarketListingType } from "@/types/marketplace.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type LuxfiListingRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  assetClass: string;
  stockQty: number;
  marketPrice: number;
  listingPrice: number;
  listingDate: string;
  status: AssetMarketListingStatus;
};

const PAGE_SIZE = 10;

export function LuxfiListingTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeListing, setActiveListing] = React.useState<AssetMarketListingType | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listingsQuery = convertObjectToQuery({
    ownerType: "platform",
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: response, isLoading } = useAssetMarketListings(listingsQuery);

  const listings = response?.data ?? [];

  const rows: LuxfiListingRow[] = listings.map((listing) => ({
    id: listing.listingId,
    assetId: listing.assetDetails.assetId,
    assetName: listing.assetDetails.assetName,
    assetClass: listing.assetDetails.assetClass,
    stockQty: listing.qtyAvailable,
    marketPrice: listing.marketPrice.value,
    listingPrice: listing.listingPrice.value,
    listingDate: formatTableDateLabel(listing.listingDate),
    status: listing.listingStatus,
  }));

  const columns: ColumnDef<LuxfiListingRow, unknown>[] = [
    createIdentifierColumn<LuxfiListingRow>("Asset ID", "assetId"),
    createTextColumn<LuxfiListingRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<LuxfiListingRow>("Class", "assetClass"),
    createTextColumn<LuxfiListingRow>("Stock QTY", "stockQty"),
    createAmountColumn<LuxfiListingRow>("Market Price", "marketPrice"),
    createAmountColumn<LuxfiListingRow>("Listing Price", "listingPrice"),
    createTextColumn<LuxfiListingRow>("Listing Date", "listingDate"),
    createStatusColumn<LuxfiListingRow, AssetMarketListingStatus>(
      "Listing Status",
      ASSET_MARKET_LISTING_STATUS_CONFIG,
    ),
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
        loading={isLoading}
        emptyStateLabel="No listings found."
        pagination={{
          totalEntries: response?.pagination.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeListing ? (
        <AssetListingDetailsModal
          open={Boolean(activeListing)}
          onOpenChange={(open) => {
            if (!open) setActiveListing(null);
          }}
          listing={activeListing}
        />
      ) : null}
    </>
  );
}
