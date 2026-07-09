"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { LiquidationOfferDetailsModal } from "@/module/dashboard/marketplace/components/modals/liquidation-offer-details-modal";
import { createAmountColumn, formatTableDateLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { useLiquidationOffersContext } from "@/module/dashboard/marketplace/context";
import { OFFER_TABLE_STATUS_CONFIG, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { LiquidationOfferType, OfferStatus } from "@/types/marketplace.type";

type LiquidationOfferRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  marketPrice: number;
  sellerName: string;
  sellingPrice: number;
  offerDate: string;
  status: OfferStatus;
};

const PAGE_SIZE = 10;

function matchesQuery(offer: LiquidationOfferType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const assetItem = resolveAssetItemById(offer.assetItemId);
  return (
    offer.assetItemId.toLowerCase().includes(normalized) ||
    offer.sellerName.toLowerCase().includes(normalized) ||
    Boolean(assetItem?.name.toLowerCase().includes(normalized))
  );
}

export function LiquidationOffersTab() {
  const { offers, updateOffer } = useLiquidationOffersContext();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeOffer, setActiveOffer] = React.useState<LiquidationOfferType | null>(null);

  const filtered = React.useMemo(
    () => offers.filter((offer) => matchesQuery(offer, value.q ?? "")),
    [offers, value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: LiquidationOfferRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((offer) => {
      const assetItem = resolveAssetItemById(offer.assetItemId);

      return {
        id: offer.offerId,
        assetId: offer.assetItemId,
        assetName: assetItem?.name ?? "-",
        marketPrice: assetItem?.estimatedValue ?? 0,
        sellerName: offer.sellerName,
        sellingPrice: offer.sellerOffer,
        offerDate: formatTableDateLabel(offer.submittedAt),
        status: offer.status,
      };
    });
  }, [currentPage, filtered]);

  const columns: ColumnDef<LiquidationOfferRow, unknown>[] = [
    createIdentifierColumn<LiquidationOfferRow>("Asset ID", "assetId"),
    createTextColumn<LiquidationOfferRow>("Asset Name", "assetName", "max-w-[180px]"),
    createAmountColumn<LiquidationOfferRow>("Market Price", "marketPrice"),
    createTextColumn<LiquidationOfferRow>("Seller Name", "sellerName", "max-w-[160px]"),
    createAmountColumn<LiquidationOfferRow>("Selling Price", "sellingPrice"),
    createTextColumn<LiquidationOfferRow>("Offer Date", "offerDate"),
    createStatusColumn<LiquidationOfferRow, OfferStatus>("Bid Status", OFFER_TABLE_STATUS_CONFIG),
    createActionColumnWithOptions<LiquidationOfferRow>({
      ariaLabel: "Review liquidation offer",
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
        emptyStateLabel="No liquidation offers found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeOffer ? (
        <LiquidationOfferDetailsModal
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
