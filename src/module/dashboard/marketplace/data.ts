import {
  mockAssetClasses,
  mockAssetItemsByClassId,
  mockUserAssetPortfolios,
} from "@/module/dashboard/asset-management/data";
import type { AssetItemType } from "@/types/asset-management.type";
import type {
  AssetMarketListingStatus,
  BuyOfferType,
  OfferStatus,
} from "@/types/marketplace.type";

export type MarketplaceTabValue =
  | "luxfi-listing"
  | "customer-listings"
  | "liquidation-offers"
  | "buy-offers"
  | "p2p-trade-requests"
  | "audit-log";

type TabConfig = {
  value: MarketplaceTabValue;
  label: string;
};

export const marketplaceTabs: TabConfig[] = [
  { value: "luxfi-listing", label: "LuxFi Listing" },
  { value: "customer-listings", label: "Customer Listings" },
  { value: "liquidation-offers", label: "Liquidation Offers" },
  { value: "buy-offers", label: "Buy Offers" },
  { value: "p2p-trade-requests", label: "P2P Trade Requests" },
  { value: "audit-log", label: "Audit Log" },
];

export const DEFAULT_MARKETPLACE_TAB: MarketplaceTabValue = "luxfi-listing";

// Shared status config for all four wired tabs (LuxFi Listing, Customer Listings,
// Liquidation Offers, P2P Trade Requests) — they all use the same review outcome now.
export const ASSET_MARKET_LISTING_STATUS_CONFIG: Record<
  AssetMarketListingStatus,
  { label: string; variant: "warning" | "success" | "error" }
> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Active", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

export const ASSET_MARKET_MODAL_STATUS_LABELS: Record<AssetMarketListingStatus, string> = {
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

// Marketplace listings used to reference existing Asset Management inventory via
// assetItemId; those lookups are still needed by Buy Offers (untouched) and by the
// create-listing flow's AssetSearchField (which searches Asset Management inventory).
export function getAllAssetItems(): AssetItemType[] {
  return Object.values(mockAssetItemsByClassId).flat();
}

export function resolveAssetItemById(assetItemId: string): AssetItemType | undefined {
  return getAllAssetItems().find((item) => item.assetId === assetItemId);
}

export function resolveAssetClassName(assetClassId: string): string {
  return mockAssetClasses.find((assetClass) => assetClass.classId === assetClassId)?.name ?? "-";
}

export type MarketplaceMetricPair = {
  left: { title: string; value: string; trend: string; tone: "positive" | "negative" };
  right: { title: string; value: string; trend: string; tone: "positive" | "negative" };
};

export const marketplaceMetricPairs: MarketplaceMetricPair[] = [
  {
    left: { title: "Total Sales Volume", value: "$2,960,000", trend: "99.9%", tone: "positive" },
    right: { title: "Total Purchase Volume", value: "$2,960,000", trend: "99.9%", tone: "positive" },
  },
  {
    left: { title: "Liquidation Offers", value: "456,908", trend: "99.9%", tone: "negative" },
    right: { title: "Buy Offers", value: "100,000", trend: "99.9%", tone: "positive" },
  },
  {
    left: { title: "Active Listings Volume", value: "6,908", trend: "99.9%", tone: "positive" },
    right: { title: "Active Listings Value", value: "$2,960,000", trend: "99.9%", tone: "positive" },
  },
];

// Bid Status column shared by every review-and-approve tab that still uses OfferStatus
// (Buy Offers tab — the only tab still mocked).
export const OFFER_TABLE_STATUS_CONFIG: Record<
  OfferStatus,
  { label: string; variant: "warning" | "success" | "error" }
> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Sold", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

// Status row inside a Buy Offer's details modal uses different copy than the table.
export const OFFER_MODAL_STATUS_LABELS: Record<OfferStatus, string> = {
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

export const REJECTION_REASON_OPTIONS = [
  { label: "Price Below Market Value", value: "Price Below Market Value" },
  { label: "Incomplete Documentation", value: "Incomplete Documentation" },
  { label: "Asset Condition Discrepancy", value: "Asset Condition Discrepancy" },
  { label: "Suspected Fraudulent Listing", value: "Suspected Fraudulent Listing" },
  { label: "Other", value: "Other" },
];

const OFFER_STATUS_CYCLE: OfferStatus[] = ["pending", "approved", "approved", "rejected"];

function makeEmailFromName(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
}

// Placeholder data standing in for GET /v1/marketplace/buy-offers until the endpoint is available.
export function generateMockBuyOffers(total: number): BuyOfferType[] {
  const assetItems = getAllAssetItems();

  if (!assetItems.length || !mockUserAssetPortfolios.length) {
    return [];
  }

  return Array.from({ length: total }, (_, index) => {
    const assetItem = assetItems[index % assetItems.length];
    const buyer = mockUserAssetPortfolios[index % mockUserAssetPortfolios.length];
    const status = OFFER_STATUS_CYCLE[index % OFFER_STATUS_CYCLE.length];
    const listingPrice = assetItem.price.value - 70;
    const buyOfferPrice = assetItem.price.value + ((index % 5) * 100 - 200);
    const isResolved = status !== "pending";

    return {
      offerId: `BO-${String(1000234 + index * 91).slice(0, 7)}`,
      orderId: `ID ${String(802725424200 + index)}`,
      assetItemId: assetItem.assetId,
      assetClassId: assetItem.assetClassId,
      buyerId: makeEmailFromName(buyer.customerName),
      buyerName: buyer.customerName,
      listingPrice,
      buyOfferPrice,
      status,
      submittedAt: "2026-01-10T00:00:00.000Z",
      resolvedAt: isResolved ? "2026-01-12T00:00:00.000Z" : undefined,
      rejectionReason: status === "rejected" ? REJECTION_REASON_OPTIONS[index % REJECTION_REASON_OPTIONS.length].value : undefined,
    };
  });
}

export const mockBuyOffers: BuyOfferType[] = generateMockBuyOffers(1000);
