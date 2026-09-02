import type { AssetMarketListingStatus } from "@/types/marketplace.type";

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

export const REJECTION_REASON_OPTIONS = [
  { label: "Price Below Market Value", value: "Price Below Market Value" },
  { label: "Incomplete Documentation", value: "Incomplete Documentation" },
  { label: "Asset Condition Discrepancy", value: "Asset Condition Discrepancy" },
  { label: "Suspected Fraudulent Listing", value: "Suspected Fraudulent Listing" },
  { label: "Other", value: "Other" },
];
