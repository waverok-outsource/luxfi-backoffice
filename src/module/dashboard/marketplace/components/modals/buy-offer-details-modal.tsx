"use client";

import { AssetDetailsPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { OfferStatusBadge, OfferSummaryCard } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { resolveAssetClassName, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { BuyOfferType } from "@/types/marketplace.type";

type BuyOfferDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: BuyOfferType;
  onOfferUpdated: (offerId: string, patch: Partial<BuyOfferType>) => void;
};

export function BuyOfferDetailsModal({ open, onOpenChange, offer, onOfferUpdated }: BuyOfferDetailsModalProps) {
  const assetItem = resolveAssetItemById(offer.assetItemId) ?? null;
  const isPending = offer.status === "pending";
  const assetLabel = assetItem ? `${assetItem.name} ${assetItem.assetId}` : offer.assetItemId;

  return (
    <OfferReviewModal
      open={open}
      onOpenChange={onOpenChange}
      title="Buy Offer Details"
      isPending={isPending}
      rejectLabel="Reject Buy Offer"
      approveLabel="Approve Buy Offer"
      approveDialog={{
        title: "Approve Offer?",
        description: (
          <>
            You are about to approve this buy offer for{" "}
            <span className="font-semibold text-text-black">{assetLabel}</span> from{" "}
            <span className="font-semibold text-text-black">{offer.buyerName}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "buy offer",
        assetName: assetItem?.name ?? "",
        assetId: assetItem?.assetId ?? offer.assetItemId,
        partyName: offer.buyerName,
      }}
      approveSuccess={{
        title: "Offer Approved",
        description: "This buy offer has been approved and the asset marked as sold.",
      }}
      rejectSuccess={{
        title: "Offer Rejected",
        description: "This buy offer has been rejected.",
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
            { label: "Buyer Name:", value: offer.buyerName },
            { label: "Buyer ID:", value: offer.buyerId },
          ]}
          primaryPriceLabel="Listing Price"
          primaryPriceValue={offer.listingPrice}
          secondaryPriceLabel="Buy Offer Price"
          secondaryPriceValue={offer.buyOfferPrice}
          dates={{
            submittedAt: offer.submittedAt,
            isPending,
            resolvedAt: offer.resolvedAt,
            resolvedDateLabel: offer.status === "rejected" ? "Date Rejected" : "Date Approved",
          }}
        />

        <AssetDetailsPanel
          assetDetails={
            assetItem
              ? {
                  dialColour: assetItem.dialColour,
                  productionYear: assetItem.productionYear,
                  weight: assetItem.weight,
                  case: assetItem.case,
                  category: assetItem.assetCategoryName,
                  assetType: assetItem.assetType ?? "",
                  assetId: assetItem.assetId,
                  assetName: assetItem.name,
                  assetClass: resolveAssetClassName(assetItem.assetClassId),
                  hasPapers: assetItem.hasPapers,
                  isBoxed: assetItem.isBoxed,
                }
              : null
          }
          images={assetItem?.uploads ?? []}
        />
      </div>
    </OfferReviewModal>
  );
}
