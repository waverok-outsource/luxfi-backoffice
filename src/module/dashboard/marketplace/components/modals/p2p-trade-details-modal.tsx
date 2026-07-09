"use client";

import { AssetDetailsPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { ModalStatusBadge, OfferSummaryCard } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { TradeStatusHistoryPanel } from "@/module/dashboard/marketplace/components/modals/trade-status-history-panel";
import {
  P2P_TRADE_MODAL_STATUS_LABELS,
  P2P_TRADE_STATUS_CONFIG,
  resolveAssetItemById,
} from "@/module/dashboard/marketplace/data";
import type { P2PTradeRequestType } from "@/types/marketplace.type";

type P2PTradeDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade: P2PTradeRequestType;
  onTradeUpdated: (tradeId: string, patch: Partial<P2PTradeRequestType>) => void;
};

export function P2PTradeDetailsModal({ open, onOpenChange, trade, onTradeUpdated }: P2PTradeDetailsModalProps) {
  const assetItem = resolveAssetItemById(trade.assetItemId) ?? null;
  const isPending = trade.status === "in-progress";
  const assetLabel = assetItem ? `${assetItem.name} ${assetItem.assetItemId}` : trade.assetItemId;

  return (
    <OfferReviewModal
      open={open}
      onOpenChange={onOpenChange}
      title="P2P Trade"
      reviewShellClassName="max-w-[1100px] p-4 sm:p-6"
      isPending={isPending}
      rejectLabel="Reject Offer"
      approveLabel="Approve Offer"
      approveDialog={{
        title: "Approve Offer?",
        description: (
          <>
            You are about to approve this P2P trade for{" "}
            <span className="font-semibold text-text-black">{assetLabel}</span> between{" "}
            <span className="font-semibold text-text-black">{trade.sellerName}</span> and{" "}
            <span className="font-semibold text-text-black">{trade.buyerName}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "P2P trade",
        assetName: assetItem?.name ?? "",
        assetId: assetItem?.assetItemId ?? trade.assetItemId,
        partyName: trade.buyerName,
      }}
      approveSuccess={{
        title: "Trade Approved",
        description: "This P2P trade has been approved and the asset released to the buyer.",
      }}
      rejectSuccess={{
        title: "Trade Cancelled",
        description: "This P2P trade has been rejected and cancelled.",
      }}
      onApprove={() => onTradeUpdated(trade.tradeId, { status: "completed", resolvedAt: new Date().toISOString() })}
      onReject={(values) =>
        onTradeUpdated(trade.tradeId, {
          status: "cancelled",
          resolvedAt: new Date().toISOString(),
          rejectionReason: values.rejectionReason,
        })
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-text-black">Buy Offer Details</p>

          <OfferSummaryCard
            statusBadge={
              <ModalStatusBadge
                variant={P2P_TRADE_STATUS_CONFIG[trade.status].variant}
                label={P2P_TRADE_MODAL_STATUS_LABELS[trade.status]}
              />
            }
            orderId={trade.orderId}
            parties={[
              { label: "Seller Name:", value: trade.sellerName },
              { label: "Buyer Name:", value: trade.buyerName },
              { label: "Buyer ID:", value: trade.buyerId },
            ]}
            primaryPriceLabel="Initial Listed Offer"
            primaryPriceValue={trade.initialListedOffer}
            secondaryPriceLabel="Seller Accepted Offer"
            secondaryPriceValue={trade.sellerAcceptedOffer}
          />

          <AssetDetailsPanel assetItem={assetItem} />
        </div>

        <TradeStatusHistoryPanel trade={trade} />
      </div>
    </OfferReviewModal>
  );
}
