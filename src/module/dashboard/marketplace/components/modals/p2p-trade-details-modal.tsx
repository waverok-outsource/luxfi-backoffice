"use client";

import { AssetDetailsPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { ModalStatusBadge, OfferSummaryCard } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { TradeStatusHistoryPanel } from "@/module/dashboard/marketplace/components/modals/trade-status-history-panel";
import { ASSET_MARKET_LISTING_STATUS_CONFIG, ASSET_MARKET_MODAL_STATUS_LABELS } from "@/module/dashboard/marketplace/data";
import useMarketplaceFns from "@/services/functions/marketplace.fns";
import type { AssetMarketListingType } from "@/types/marketplace.type";

type P2PTradeDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: AssetMarketListingType;
};

export function P2PTradeDetailsModal({ open, onOpenChange, listing }: P2PTradeDetailsModalProps) {
  const { reviewListing } = useMarketplaceFns();
  const isPending = listing.listingStatus === "pending";
  const assetLabel = `${listing.assetDetails.assetName} ${listing.assetDetails.assetId}`;

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
            <span className="font-semibold text-text-black">{assetLabel}</span> from{" "}
            <span className="font-semibold text-text-black">{listing.seller.name}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "P2P trade",
        assetName: listing.assetDetails.assetName,
        assetId: listing.assetDetails.assetId,
        partyName: listing.seller.name,
      }}
      approveSuccess={{
        title: "Trade Approved",
        description: "This P2P trade has been approved and the asset released to the buyer.",
      }}
      rejectSuccess={{
        title: "Trade Cancelled",
        description: "This P2P trade has been rejected and cancelled.",
      }}
      onApprove={() => reviewListing(listing.listingId, { status: "approved" })}
      onReject={() => reviewListing(listing.listingId, { status: "rejected" })}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
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
              { label: "Buyer Name:", value: "-" },
              { label: "Buyer ID:", value: "-" },
            ]}
            primaryPriceLabel="Initial Listed Offer"
            primaryPriceValue={listing.listingPrice.value}
            secondaryPriceLabel="Seller Accepted Offer"
            secondaryPriceValue={null}
          />

          <AssetDetailsPanel assetDetails={listing.assetDetails} images={listing.assetImages} />
        </div>

        <TradeStatusHistoryPanel
          submittedAt={listing.listingDate}
          resolvedAt={listing.listingStatus !== "pending" ? listing.lastUpdated : undefined}
          status={listing.listingStatus}
        />
      </div>
    </OfferReviewModal>
  );
}
