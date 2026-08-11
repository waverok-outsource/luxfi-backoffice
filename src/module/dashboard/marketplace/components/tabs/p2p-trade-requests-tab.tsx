"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { P2PTradeDetailsModal } from "@/module/dashboard/marketplace/components/modals/p2p-trade-details-modal";
import { createAmountColumn, formatTableDateLabel, formatTableTimeLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { ASSET_MARKET_LISTING_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import { useAssetMarketListings } from "@/services/queries/marketplace.queries";
import type { AssetMarketListingStatus, AssetMarketListingType } from "@/types/marketplace.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type P2PTradeRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  initialListedOffer: number;
  sellerAcceptedOffer: string;
  sellerName: string;
  sellerId: string;
  buyerName: string;
  buyerId: string;
  orderId: string;
  tradeDate: string;
  tradeTimestamp: string;
  status: AssetMarketListingStatus;
};

const PAGE_SIZE = 10;

export function P2PTradeRequestsTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeTrade, setActiveTrade] = React.useState<AssetMarketListingType | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listingsQuery = convertObjectToQuery({
    listingType: "p2p",
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: response, isLoading } = useAssetMarketListings(listingsQuery);

  const listings = response?.data ?? [];

  const rows: P2PTradeRow[] = listings.map((listing) => ({
    id: listing.listingId,
    assetId: listing.assetDetails.assetId,
    assetName: listing.assetDetails.assetName,
    initialListedOffer: listing.listingPrice.value,
    sellerAcceptedOffer: "-",
    sellerName: listing.seller.name,
    sellerId: listing.seller.email,
    buyerName: "-",
    buyerId: "-",
    orderId: "-",
    tradeDate: formatTableDateLabel(listing.listingDate),
    tradeTimestamp: formatTableTimeLabel(listing.listingDate),
    status: listing.listingStatus,
  }));

  const columns: ColumnDef<P2PTradeRow, unknown>[] = [
    createIdentifierColumn<P2PTradeRow>("Asset ID", "assetId"),
    createTextColumn<P2PTradeRow>("Asset Name", "assetName", "max-w-[180px]"),
    createAmountColumn<P2PTradeRow>("Initial Listed Offer", "initialListedOffer"),
    createTextColumn<P2PTradeRow>("Seller Accepted Offer", "sellerAcceptedOffer"),
    createTextColumn<P2PTradeRow>("Seller Name", "sellerName", "max-w-[160px]"),
    createTextColumn<P2PTradeRow>("Buyer Name", "buyerName", "max-w-[160px]"),
    createTextColumn<P2PTradeRow>("Order ID", "orderId"),
    createTextColumn<P2PTradeRow>("Date", "tradeDate"),
    createTextColumn<P2PTradeRow>("Timestamp", "tradeTimestamp"),
    createStatusColumn<P2PTradeRow, AssetMarketListingStatus>("Trade Status", ASSET_MARKET_LISTING_STATUS_CONFIG),
    createActionColumnWithOptions<P2PTradeRow>({
      ariaLabel: "Review P2P trade",
      onView: (row) => {
        const trade = listings.find((candidate) => candidate.listingId === row.id);
        if (trade) setActiveTrade(trade);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No P2P trade requests found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeTrade ? (
        <P2PTradeDetailsModal
          open={Boolean(activeTrade)}
          onOpenChange={(open) => {
            if (!open) setActiveTrade(null);
          }}
          listing={activeTrade}
        />
      ) : null}
    </>
  );
}
