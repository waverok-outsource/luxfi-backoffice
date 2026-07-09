"use client";

import { Button } from "@/components/ui/button";
import { ValuationInfoBox, ValuationPanelShell } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import type { AssetItemType } from "@/types/asset-management.type";
import type { CustomerListingType } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type CustomerListingValuationPanelProps = {
  assetItem: AssetItemType | null;
  listing: CustomerListingType;
  onTriggerBuyOffer: () => void;
};

export function CustomerListingValuationPanel({
  assetItem,
  listing,
  onTriggerBuyOffer,
}: CustomerListingValuationPanelProps) {
  const isActive = listing.listingStatus === "active";

  return (
    <ValuationPanelShell>
      <ValuationInfoBox
        label="Unit Market Price"
        value={assetItem ? formatCurrency(assetItem.estimatedValue) : "N/A"}
        trend={assetItem ? { value: "2.2%", tone: "negative", period: "Last 24 hrs" } : undefined}
      />

      <ValuationInfoBox
        label="Unit Retail Price"
        value={formatCurrency(listing.unitRetailPrice)}
        trend={{ value: "2.2%", tone: "negative", period: "Last 24 hrs" }}
      />

      <ValuationInfoBox label="Initial Liquidation Offer" value={formatCurrency(listing.initialLiquidationOffer)} />

      <ValuationInfoBox
        label="Seller Listing Price"
        value={formatCurrency(listing.sellerListingPrice)}
        tone="highlight"
      />

      <Button
        type="button"
        variant={isActive ? "gold" : "grey-stroke"}
        disabled={!isActive}
        className="w-full"
        onClick={onTriggerBuyOffer}
      >
        Trigger Buy Offer
      </Button>
    </ValuationPanelShell>
  );
}
