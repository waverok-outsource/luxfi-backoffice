"use client";

import { AssetDetailsPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { OfferStatusBadge, OfferSummaryCard } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { LiquidationOfferType } from "@/types/marketplace.type";

type LiquidationOfferDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: LiquidationOfferType;
  onOfferUpdated: (offerId: string, patch: Partial<LiquidationOfferType>) => void;
};

export function LiquidationOfferDetailsModal({
  open,
  onOpenChange,
  offer,
  onOfferUpdated,
}: LiquidationOfferDetailsModalProps) {
  const assetItem = resolveAssetItemById(offer.assetItemId) ?? null;
  const isPending = offer.status === "pending";
  const assetLabel = assetItem ? `${assetItem.name} ${assetItem.assetItemId}` : offer.assetItemId;

  return (
    <OfferReviewModal
      open={open}
      onOpenChange={onOpenChange}
      title="Liquidation Offer Details"
      isPending={isPending}
      rejectLabel="Reject Offer"
      approveLabel="Approve Offer"
      approveDialog={{
        title: "Approve Offer?",
        description: (
          <>
            You are about to approve this liquidation offer for{" "}
            <span className="font-semibold text-text-black">{assetLabel}</span> from{" "}
            <span className="font-semibold text-text-black">{offer.sellerName}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "liquidation offer",
        assetName: assetItem?.name ?? "",
        assetId: assetItem?.assetItemId ?? offer.assetItemId,
        partyName: offer.sellerName,
      }}
      approveSuccess={{
        title: "Offer Approved",
        description: "This liquidation offer has been approved and the asset marked as sold.",
      }}
      rejectSuccess={{
        title: "Offer Rejected",
        description: "This liquidation offer has been rejected.",
      }}
      onApprove={() => onOfferUpdated(offer.offerId, { status: "approved", resolvedAt: new Date().toISOString() })}
      onReject={(values) =>
        onOfferUpdated(offer.offerId, {
          status: "rejected",
          resolvedAt: new Date().toISOString(),
          rejectionReason: values.rejectionReason,
        })
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-black">Buy Offer Details</p>

        <OfferSummaryCard
          statusBadge={<OfferStatusBadge status={offer.status} />}
          orderId={offer.orderId}
          parties={[
            { label: "Seller Name:", value: offer.sellerName },
            { label: "Seller ID:", value: offer.sellerId },
          ]}
          primaryPriceLabel="Initial Liquidation Offer"
          primaryPriceValue={offer.initialLiquidationOffer}
          secondaryPriceLabel="Seller Offer"
          secondaryPriceValue={offer.sellerOffer}
          dates={{
            submittedAt: offer.submittedAt,
            isPending,
            resolvedAt: offer.resolvedAt,
            resolvedDateLabel: offer.status === "rejected" ? "Date Rejected" : "Date Approved",
          }}
        />

        <AssetDetailsPanel assetItem={assetItem} />
      </div>
    </OfferReviewModal>
  );
}
