import {
  mockAssetClasses,
  mockAssetItemsByClassId,
  mockUserAssetPortfolios,
} from "@/module/dashboard/asset-management/data";
import type { AssetItemType } from "@/types/asset-management.type";
import type {
  BuyOfferType,
  CustomerListingStatus,
  CustomerListingType,
  LiquidationOfferType,
  MarketplaceAuditLogAction,
  MarketplaceAuditLogEntry,
  MarketplaceListingStatus,
  MarketplaceListingType,
  OfferStatus,
  P2PTradeRequestType,
  P2PTradeStatus,
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

// Shared by the LuxFi Listing table and the Asset Listing Details modal.
export const LISTING_STATUS_CONFIG: Record<
  MarketplaceListingStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  listed: { label: "Listed", variant: "success" },
  unlisted: { label: "Unlisted", variant: "neutral" },
};

// Marketplace listings reference existing Asset Management inventory rather than
// duplicating asset data, so lookups read straight from that module's mock exports.
export function getAllAssetItems(): AssetItemType[] {
  return Object.values(mockAssetItemsByClassId).flat();
}

export function resolveAssetItemById(assetItemId: string): AssetItemType | undefined {
  return getAllAssetItems().find((item) => item.assetItemId === assetItemId);
}

export function resolveAssetClassName(assetClassId: string): string {
  return mockAssetClasses.find((assetClass) => assetClass.assetClassId === assetClassId)?.name ?? "-";
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

const LISTED_BY_EMAILS = [
  "Admin@pawnshopbyblu.com",
  "Zenikoku@pawnshopbyblu.com",
  "Oreoluwaakinnagbe@pawnshopbyblu.com",
] as const;

const STATUS_CYCLE: MarketplaceListingStatus[] = ["listed", "listed", "listed", "unlisted"];

// Placeholder data standing in for GET /v1/marketplace/listings until the endpoint is available.
export function generateMockMarketplaceListings(total: number): MarketplaceListingType[] {
  const assetItems = getAllAssetItems();

  if (!assetItems.length) {
    return [];
  }

  return Array.from({ length: total }, (_, index) => {
    const assetItem = assetItems[index % assetItems.length];
    const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
    const totalAvailableQuantity = 5 + (index % 10);
    const totalSoldQuantity = index % 6;

    return {
      listingId: `MKT-${String(1000234 + index * 91).slice(0, 7)}`,
      assetItemId: assetItem.assetItemId,
      assetClassId: assetItem.assetClassId,
      listingPrice: assetItem.estimatedValue + ((index % 5) * 100 - 200),
      additionalInfo: "",
      isBoxPackaged: index % 2 === 0,
      hasCertificationPapers: index % 3 !== 0,
      listedBy: LISTED_BY_EMAILS[index % LISTED_BY_EMAILS.length],
      listingStatus: status,
      listedAt: "2026-04-10T00:00:00.000Z",
      lastUpdatedAt: "2026-04-22T00:00:00.000Z",
      totalAvailableQuantity,
      totalAvailableCost: totalAvailableQuantity * assetItem.estimatedValue,
      totalSoldQuantity,
      totalSoldCost: totalSoldQuantity * assetItem.estimatedValue,
    };
  });
}

export const mockMarketplaceListings: MarketplaceListingType[] = generateMockMarketplaceListings(1000);

// Shared by the Customer Listings table and the Customer Listing Review modal.
export const CUSTOMER_LISTING_STATUS_CONFIG: Record<
  CustomerListingStatus,
  { label: string; variant: "warning" | "success" | "disabled" }
> = {
  pending: { label: "Pending", variant: "warning" },
  active: { label: "Active", variant: "success" },
  rejected: { label: "Rejected", variant: "disabled" },
};

const CUSTOMER_LISTING_STATUS_CYCLE: CustomerListingStatus[] = ["pending", "active", "active", "rejected"];

// Placeholder data standing in for GET /v1/marketplace/customer-listings until the endpoint is available.
export function generateMockCustomerListings(total: number): CustomerListingType[] {
  const assetItems = getAllAssetItems();

  if (!assetItems.length || !mockUserAssetPortfolios.length) {
    return [];
  }

  return Array.from({ length: total }, (_, index) => {
    const assetItem = assetItems[index % assetItems.length];
    const customer = mockUserAssetPortfolios[index % mockUserAssetPortfolios.length];
    const status = CUSTOMER_LISTING_STATUS_CYCLE[index % CUSTOMER_LISTING_STATUS_CYCLE.length];
    const unitRetailPrice = assetItem.estimatedValue + ((index % 5) * 100 - 200);
    const initialLiquidationOffer = assetItem.estimatedValue - 70;
    const sellerListingPrice = assetItem.estimatedValue - ((index % 4) * 50 - 20);

    return {
      listingId: `CL-${String(1000234 + index * 91).slice(0, 7)}`,
      assetItemId: assetItem.assetItemId,
      assetClassId: assetItem.assetClassId,
      customerId: customer.portfolioId,
      customerName: customer.customerName,
      unitRetailPrice,
      initialLiquidationOffer,
      sellerListingPrice,
      isBoxPackaged: index % 2 === 0,
      hasCertificationPapers: index % 3 !== 0,
      listingStatus: status,
      submittedAt: "2026-04-22T00:00:00.000Z",
      lastUpdatedAt: "2026-04-22T00:00:00.000Z",
    };
  });
}

export const mockCustomerListings: CustomerListingType[] = generateMockCustomerListings(1000);

// Bid Status column shared by every review-and-approve tab (Liquidation Offers, Buy Offers, ...)
// — "approved" reads as "Sold" here, since an approved offer means the asset changed hands.
export const OFFER_TABLE_STATUS_CONFIG: Record<
  OfferStatus,
  { label: string; variant: "warning" | "success" | "error" }
> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Sold", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

// Status row inside an offer's details modal uses different copy than the table.
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

// Placeholder data standing in for GET /v1/marketplace/liquidation-offers until the endpoint is available.
export function generateMockLiquidationOffers(total: number): LiquidationOfferType[] {
  const assetItems = getAllAssetItems();

  if (!assetItems.length || !mockUserAssetPortfolios.length) {
    return [];
  }

  return Array.from({ length: total }, (_, index) => {
    const assetItem = assetItems[index % assetItems.length];
    const seller = mockUserAssetPortfolios[index % mockUserAssetPortfolios.length];
    const status = OFFER_STATUS_CYCLE[index % OFFER_STATUS_CYCLE.length];
    const initialLiquidationOffer = assetItem.estimatedValue - 70;
    const sellerOffer = assetItem.estimatedValue + ((index % 5) * 100 - 200);
    const isResolved = status !== "pending";

    return {
      offerId: `LQ-${String(1000234 + index * 91).slice(0, 7)}`,
      orderId: `ID ${String(802725424200 + index)}`,
      assetItemId: assetItem.assetItemId,
      assetClassId: assetItem.assetClassId,
      sellerId: makeEmailFromName(seller.customerName),
      sellerName: seller.customerName,
      initialLiquidationOffer,
      sellerOffer,
      status,
      submittedAt: "2026-01-10T00:00:00.000Z",
      resolvedAt: isResolved ? "2026-01-12T00:00:00.000Z" : undefined,
      rejectionReason: status === "rejected" ? REJECTION_REASON_OPTIONS[index % REJECTION_REASON_OPTIONS.length].value : undefined,
    };
  });
}

export const mockLiquidationOffers: LiquidationOfferType[] = generateMockLiquidationOffers(1000);

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
    const listingPrice = assetItem.estimatedValue - 70;
    const buyOfferPrice = assetItem.estimatedValue + ((index % 5) * 100 - 200);
    const isResolved = status !== "pending";

    return {
      offerId: `BO-${String(1000234 + index * 91).slice(0, 7)}`,
      orderId: `ID ${String(802725424200 + index)}`,
      assetItemId: assetItem.assetItemId,
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

// Trade Status column of the P2P Trade Requests table.
export const P2P_TRADE_STATUS_CONFIG: Record<
  P2PTradeStatus,
  { label: string; variant: "warning" | "success" | "error" }
> = {
  "in-progress": { label: "In progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
};

// Status row inside the P2P Trade details modal uses different copy than the table.
export const P2P_TRADE_MODAL_STATUS_LABELS: Record<P2PTradeStatus, string> = {
  "in-progress": "Pending Approval",
  completed: "Completed",
  cancelled: "Cancelled",
};

const P2P_TRADE_STATUS_CYCLE: P2PTradeStatus[] = ["completed", "cancelled", "in-progress", "completed", "completed"];

// Placeholder data standing in for GET /v1/marketplace/p2p-trades until the endpoint is available.
export function generateMockP2PTradeRequests(total: number): P2PTradeRequestType[] {
  const assetItems = getAllAssetItems();

  if (!assetItems.length || !mockUserAssetPortfolios.length) {
    return [];
  }

  return Array.from({ length: total }, (_, index) => {
    const assetItem = assetItems[index % assetItems.length];
    const seller = mockUserAssetPortfolios[index % mockUserAssetPortfolios.length];
    const buyer = mockUserAssetPortfolios[(index + 3) % mockUserAssetPortfolios.length];
    const status = P2P_TRADE_STATUS_CYCLE[index % P2P_TRADE_STATUS_CYCLE.length];
    const initialListedOffer = assetItem.estimatedValue - 70;
    const sellerAcceptedOffer = assetItem.estimatedValue + ((index % 5) * 100 - 200);
    const isResolved = status !== "in-progress";

    return {
      tradeId: `P2P-${String(1000234 + index * 91).slice(0, 7)}`,
      orderId: `ID ${String(802725424200 + index)}`,
      assetItemId: assetItem.assetItemId,
      assetClassId: assetItem.assetClassId,
      sellerId: makeEmailFromName(seller.customerName),
      sellerName: seller.customerName,
      buyerId: makeEmailFromName(buyer.customerName),
      buyerName: buyer.customerName,
      initialListedOffer,
      sellerAcceptedOffer,
      status,
      submittedAt: "2026-01-10T09:01:45.000Z",
      resolvedAt: isResolved ? "2026-05-04T09:01:45.000Z" : undefined,
      rejectionReason:
        status === "cancelled" ? REJECTION_REASON_OPTIONS[index % REJECTION_REASON_OPTIONS.length].value : undefined,
    };
  });
}

export const mockP2PTradeRequests: P2PTradeRequestType[] = generateMockP2PTradeRequests(1000);

const AUDIT_LOG_INITIATORS = [
  { initiatorName: "Zen Ikoku", initiatorRole: "Admin" },
  { initiatorName: "Oreoluwa Akinnagbe", initiatorRole: "Compliance" },
  { initiatorName: "Ozumba Ifeanyi", initiatorRole: "Compliance" },
  { initiatorName: "Uthman Lolade", initiatorRole: "Compliance" },
] as const;

const AUDIT_LOG_ACTION_CYCLE: MarketplaceAuditLogAction[] = [
  "Approved Buy",
  "Approved Sell",
  "Listed Asset",
  "Unlisted Asset",
  "Approved Listing",
];

// Placeholder data standing in for GET /v1/marketplace/audit-logs until the endpoint is available.
export function generateMockMarketplaceAuditLogs(total: number): MarketplaceAuditLogEntry[] {
  return Array.from({ length: total }, (_, index) => {
    const initiator = AUDIT_LOG_INITIATORS[index % AUDIT_LOG_INITIATORS.length];

    return {
      logId: String(1000234 + index * 137),
      assetId: String(200111 + index * 53),
      action: AUDIT_LOG_ACTION_CYCLE[index % AUDIT_LOG_ACTION_CYCLE.length],
      actionTimestampLabel: "10:23 AM",
      actionDateLabel: "07/02/2026",
      initiatorId: String(85752257 + index).padStart(12, "0"),
      initiatorName: initiator.initiatorName,
      initiatorRole: initiator.initiatorRole,
    };
  });
}

export const mockMarketplaceAuditLogs: MarketplaceAuditLogEntry[] = generateMockMarketplaceAuditLogs(1000);
