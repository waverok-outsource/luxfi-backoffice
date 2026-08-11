"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { BuyOfferDetailsModal } from "@/module/dashboard/marketplace/components/modals/buy-offer-details-modal";
import { createAmountColumn, formatTableDateLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { useBuyOffersContext } from "@/module/dashboard/marketplace/context";
import { OFFER_TABLE_STATUS_CONFIG, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { BuyOfferType, OfferStatus } from "@/types/marketplace.type";

type BuyOfferRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  marketPrice: number;
  buyerName: string;
  listingPrice: number;
  offerDate: string;
  status: OfferStatus;
};

const PAGE_SIZE = 10;

function matchesQuery(offer: BuyOfferType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const assetItem = resolveAssetItemById(offer.assetItemId);
  return (
    offer.assetItemId.toLowerCase().includes(normalized) ||
    offer.buyerName.toLowerCase().includes(normalized) ||
    Boolean(assetItem?.name.toLowerCase().includes(normalized))
  );
}

export function BuyOffersTab() {
  const { offers, updateOffer } = useBuyOffersContext();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeOffer, setActiveOffer] = React.useState<BuyOfferType | null>(null);

  const filtered = React.useMemo(
    () => offers.filter((offer) => matchesQuery(offer, value.q ?? "")),
    [offers, value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: BuyOfferRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((offer) => {
      const assetItem = resolveAssetItemById(offer.assetItemId);

      return {
        id: offer.offerId,
        assetId: offer.assetItemId,
        assetName: assetItem?.name ?? "-",
        marketPrice: assetItem?.price.value ?? 0,
        buyerName: offer.buyerName,
        listingPrice: offer.listingPrice,
        offerDate: formatTableDateLabel(offer.submittedAt),
        status: offer.status,
      };
    });
  }, [currentPage, filtered]);

  const columns: ColumnDef<BuyOfferRow, unknown>[] = [
    createIdentifierColumn<BuyOfferRow>("Asset ID", "assetId"),
    createTextColumn<BuyOfferRow>("Asset Name", "assetName", "max-w-[180px]"),
    createAmountColumn<BuyOfferRow>("Market Price", "marketPrice"),
    createTextColumn<BuyOfferRow>("Buyer Name", "buyerName", "max-w-[160px]"),
    createAmountColumn<BuyOfferRow>("Listing Price", "listingPrice"),
    createTextColumn<BuyOfferRow>("Offer Date", "offerDate"),
    createStatusColumn<BuyOfferRow, OfferStatus>("Bid Status", OFFER_TABLE_STATUS_CONFIG),
    createActionColumnWithOptions<BuyOfferRow>({
      ariaLabel: "Review buy offer",
      onView: (row) => {
        const offer = offers.find((candidate) => candidate.offerId === row.id);
        if (offer) setActiveOffer(offer);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No buy offers found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeOffer ? (
        <BuyOfferDetailsModal
          open={Boolean(activeOffer)}
          onOpenChange={(open) => {
            if (!open) setActiveOffer(null);
          }}
          offer={activeOffer}
          onOfferUpdated={(offerId, patch) => {
            updateOffer(offerId, patch);
            setActiveOffer((previous) => (previous ? { ...previous, ...patch } : previous));
          }}
        />
      ) : null}
    </>
  );
}
