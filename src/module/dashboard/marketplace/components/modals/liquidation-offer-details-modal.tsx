"use client";

import { AssetDetailsPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { ModalStatusBadge, OfferSummaryCard } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { ASSET_MARKET_LISTING_STATUS_CONFIG, ASSET_MARKET_MODAL_STATUS_LABELS } from "@/module/dashboard/marketplace/data";
import useMarketplaceFns from "@/services/functions/marketplace.fns";
import type { AssetMarketListingType } from "@/types/marketplace.type";

type LiquidationOfferDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: AssetMarketListingType;
};

export function LiquidationOfferDetailsModal({
  open,
  onOpenChange,
  listing,
}: LiquidationOfferDetailsModalProps) {
  const { reviewListing } = useMarketplaceFns();
  const isPending = listing.listingStatus === "pending";
  const assetLabel = `${listing.assetDetails.assetName} ${listing.assetDetails.assetId}`;

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
            <span className="font-semibold text-text-black">{listing.seller.name}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "liquidation offer",
        assetName: listing.assetDetails.assetName,
        assetId: listing.assetDetails.assetId,
        partyName: listing.seller.name,
      }}
      approveSuccess={{
        title: "Offer Approved",
        description: "This liquidation offer has been approved and the asset marked as sold.",
      }}
      rejectSuccess={{
        title: "Offer Rejected",
        description: "This liquidation offer has been rejected.",
      }}
      onApprove={() => reviewListing(listing.listingId, { status: "approved" })}
      onReject={() => reviewListing(listing.listingId, { status: "rejected" })}
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-black">Buy Offer Details</p>

        <OfferSummaryCard
          statusBadge={
            <ModalStatusBadge
              variant={ASSET_MARKET_LISTING_STATUS_CONFIG[listing.listingStatus].variant}
              label={ASSET_MARKET_MODAL_STATUS_LABELS[listing.listingStatus]}
            />
          }
          orderId="-"
          parties={[
            { label: "Seller Name:", value: listing.seller.name },
            { label: "Seller ID:", value: listing.seller.email },
          ]}
          primaryPriceLabel="Initial Liquidation Offer"
          primaryPriceValue={listing.liquidationPrice.value}
          secondaryPriceLabel="Seller Offer"
          secondaryPriceValue={listing.listingPrice.value}
          dates={{
            submittedAt: listing.listingDate,
            isPending,
            resolvedAt: listing.listingStatus !== "pending" ? listing.lastUpdated : undefined,
            resolvedDateLabel: listing.listingStatus === "rejected" ? "Date Rejected" : "Date Approved",
          }}
        />

        <AssetDetailsPanel assetDetails={listing.assetDetails} images={listing.assetImages} />
      </div>
    </OfferReviewModal>
  );
}
