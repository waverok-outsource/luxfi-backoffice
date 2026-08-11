"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { LiquidationOfferDetailsModal } from "@/module/dashboard/marketplace/components/modals/liquidation-offer-details-modal";
import { createAmountColumn, formatTableDateLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { ASSET_MARKET_LISTING_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import { useAssetMarketListings } from "@/services/queries/marketplace.queries";
import type { AssetMarketListingStatus, AssetMarketListingType } from "@/types/marketplace.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type LiquidationOfferRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  marketPrice: number;
  sellerName: string;
  sellerId: string;
  initialLiquidationOffer: number;
  sellerOffer: number;
  orderId: string;
  offerDate: string;
  status: AssetMarketListingStatus;
};

const PAGE_SIZE = 10;

export function LiquidationOffersTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeOffer, setActiveOffer] = React.useState<AssetMarketListingType | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listingsQuery = convertObjectToQuery({
    listingType: "liquidation",
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: response, isLoading } = useAssetMarketListings(listingsQuery);

  const listings = response?.data ?? [];

  const rows: LiquidationOfferRow[] = listings.map((listing) => ({
    id: listing.listingId,
    assetId: listing.assetDetails.assetId,
    assetName: listing.assetDetails.assetName,
    marketPrice: listing.marketPrice.value,
    sellerName: listing.seller.name,
    sellerId: listing.seller.email,
    initialLiquidationOffer: listing.liquidationPrice.value,
    sellerOffer: listing.listingPrice.value,
    orderId: "-",
    offerDate: formatTableDateLabel(listing.listingDate),
    status: listing.listingStatus,
  }));

  const columns: ColumnDef<LiquidationOfferRow, unknown>[] = [
    createIdentifierColumn<LiquidationOfferRow>("Asset ID", "assetId"),
    createTextColumn<LiquidationOfferRow>("Asset Name", "assetName", "max-w-[180px]"),
    createAmountColumn<LiquidationOfferRow>("Market Price", "marketPrice"),
    createTextColumn<LiquidationOfferRow>("Seller Name", "sellerName", "max-w-[160px]"),
    createAmountColumn<LiquidationOfferRow>("Initial Liquidation Offer", "initialLiquidationOffer"),
    createAmountColumn<LiquidationOfferRow>("Seller Offer", "sellerOffer"),
    createTextColumn<LiquidationOfferRow>("Order ID", "orderId"),
    createTextColumn<LiquidationOfferRow>("Offer Date", "offerDate"),
    createStatusColumn<LiquidationOfferRow, AssetMarketListingStatus>("Bid Status", ASSET_MARKET_LISTING_STATUS_CONFIG),
    createActionColumnWithOptions<LiquidationOfferRow>({
      ariaLabel: "Review liquidation offer",
      onView: (row) => {
        const offer = listings.find((candidate) => candidate.listingId === row.id);
        if (offer) setActiveOffer(offer);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No liquidation offers found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeOffer ? (
        <LiquidationOfferDetailsModal
          open={Boolean(activeOffer)}
          onOpenChange={(open) => {
            if (!open) setActiveOffer(null);
          }}
          listing={activeOffer}
        />
      ) : null}
    </>
  );
}
