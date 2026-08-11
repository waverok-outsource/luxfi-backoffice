"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { CustomerListingReviewModal } from "@/module/dashboard/marketplace/components/modals/customer-listing-review-modal";
import { createAmountColumn, formatTableDateLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { ASSET_MARKET_LISTING_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import { useAssetMarketListings } from "@/services/queries/marketplace.queries";
import type { AssetMarketListingStatus, AssetMarketListingType } from "@/types/marketplace.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type CustomerListingRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  customerName: string;
  assetName: string;
  assetClass: string;
  marketPrice: number;
  listingPrice: number;
  listingDate: string;
  status: AssetMarketListingStatus;
};

const PAGE_SIZE = 10;

export function CustomerListingsTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeListing, setActiveListing] = React.useState<AssetMarketListingType | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listingsQuery = convertObjectToQuery({
    ownerType: "customer",
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: response, isLoading } = useAssetMarketListings(listingsQuery);

  const listings = response?.data ?? [];

  const rows: CustomerListingRow[] = listings.map((listing) => ({
    id: listing.listingId,
    assetId: listing.assetDetails.assetId,
    customerName: listing.seller.name,
    assetName: listing.assetDetails.assetName,
    assetClass: listing.assetDetails.assetClass,
    marketPrice: listing.marketPrice.value,
    listingPrice: listing.listingPrice.value,
    listingDate: formatTableDateLabel(listing.listingDate),
    status: listing.listingStatus,
  }));

  const columns: ColumnDef<CustomerListingRow, unknown>[] = [
    createIdentifierColumn<CustomerListingRow>("Asset ID", "assetId"),
    createTextColumn<CustomerListingRow>("Customer Name", "customerName", "max-w-[160px]"),
    createTextColumn<CustomerListingRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<CustomerListingRow>("Class", "assetClass"),
    createAmountColumn<CustomerListingRow>("Market Price", "marketPrice"),
    createAmountColumn<CustomerListingRow>("Listing Price", "listingPrice"),
    createTextColumn<CustomerListingRow>("Listing Date", "listingDate"),
    createStatusColumn<CustomerListingRow, AssetMarketListingStatus>(
      "Listing Status",
      ASSET_MARKET_LISTING_STATUS_CONFIG,
    ),
    createActionColumnWithOptions<CustomerListingRow>({
      ariaLabel: "Review customer listing",
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
        emptyStateLabel="No customer listings found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeListing ? (
        <CustomerListingReviewModal
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
