"use client";

import { Button } from "@/components/ui/button";
import { ValuationInfoBox, ValuationPanelShell } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import type { AssetMarketListingType } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type CustomerListingValuationPanelProps = {
  listing: AssetMarketListingType;
  onTriggerBuyOffer: () => void;
};

export function CustomerListingValuationPanel({
  listing,
  onTriggerBuyOffer,
}: CustomerListingValuationPanelProps) {
  const isActive = listing.listingStatus === "approved";

  return (
    <ValuationPanelShell>
      <ValuationInfoBox
        label="Unit Market Price"
        value={formatCurrency(listing.marketPrice.value, listing.marketPrice.currencyCode)}
        trend={{ value: "2.2%", tone: "negative", period: "Last 24 hrs" }}
      />

      <ValuationInfoBox
        label="Unit Retail Price"
        value={formatCurrency(listing.retailPrice.value, listing.retailPrice.currencyCode)}
        trend={{ value: "2.2%", tone: "negative", period: "Last 24 hrs" }}
      />

      <ValuationInfoBox label="Initial Liquidation Offer" value={formatCurrency(listing.liquidationPrice.value, listing.liquidationPrice.currencyCode)} />

      <ValuationInfoBox
        label="Seller Listing Price"
        value={formatCurrency(listing.listingPrice.value, listing.listingPrice.currencyCode)}
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
