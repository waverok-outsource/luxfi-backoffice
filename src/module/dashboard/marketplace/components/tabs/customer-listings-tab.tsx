"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { createAmountColumn, formatTableDateLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { CustomerListingReviewModal } from "@/module/dashboard/marketplace/components/modals/customer-listing-review-modal";
import { useCustomerListingsContext } from "@/module/dashboard/marketplace/context";
import { CUSTOMER_LISTING_STATUS_CONFIG, resolveAssetClassName, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { CustomerListingStatus, CustomerListingType } from "@/types/marketplace.type";

type CustomerListingRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  customerName: string;
  assetName: string;
  assetClass: string;
  marketPrice: number;
  listingPrice: number;
  listingDate: string;
  status: CustomerListingStatus;
};

const PAGE_SIZE = 10;

function matchesQuery(listing: CustomerListingType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const assetItem = resolveAssetItemById(listing.assetItemId);
  return (
    listing.assetItemId.toLowerCase().includes(normalized) ||
    listing.customerName.toLowerCase().includes(normalized) ||
    Boolean(assetItem?.name.toLowerCase().includes(normalized))
  );
}

export function CustomerListingsTab() {
  const { listings, updateListing } = useCustomerListingsContext();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeListing, setActiveListing] = React.useState<CustomerListingType | null>(null);

  const filtered = React.useMemo(
    () => listings.filter((listing) => matchesQuery(listing, value.q ?? "")),
    [listings, value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: CustomerListingRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((listing) => {
      const assetItem = resolveAssetItemById(listing.assetItemId);

      return {
        id: listing.listingId,
        assetId: listing.assetItemId,
        customerName: listing.customerName,
        assetName: assetItem?.name ?? "-",
        assetClass: resolveAssetClassName(listing.assetClassId),
        marketPrice: assetItem?.estimatedValue ?? 0,
        listingPrice: listing.sellerListingPrice,
        listingDate: formatTableDateLabel(listing.submittedAt),
        status: listing.listingStatus,
      };
    });
  }, [currentPage, filtered]);

  const columns: ColumnDef<CustomerListingRow, unknown>[] = [
    createIdentifierColumn<CustomerListingRow>("Asset ID", "assetId"),
    createTextColumn<CustomerListingRow>("Customer Name", "customerName", "max-w-[160px]"),
    createTextColumn<CustomerListingRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<CustomerListingRow>("Class", "assetClass"),
    createAmountColumn<CustomerListingRow>("Market Price", "marketPrice"),
    createAmountColumn<CustomerListingRow>("Listing Price", "listingPrice"),
    createTextColumn<CustomerListingRow>("Listing Date", "listingDate"),
    createStatusColumn<CustomerListingRow, CustomerListingStatus>(
      "Listing Status",
      CUSTOMER_LISTING_STATUS_CONFIG,
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
        emptyStateLabel="No customer listings found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeListing ? (
        <CustomerListingReviewModal
          open={Boolean(activeListing)}
          onOpenChange={(open) => {
            if (!open) setActiveListing(null);
          }}
          listing={activeListing}
          onListingUpdated={(listingId, patch) => {
            updateListing(listingId, patch);
            setActiveListing((previous) => (previous ? { ...previous, ...patch } : previous));
          }}
        />
      ) : null}
    </>
  );
}
