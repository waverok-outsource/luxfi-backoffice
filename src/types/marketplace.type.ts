export type MarketplaceListingStatus = "listed" | "unlisted";

export type MarketplaceListingType = {
  listingId: string;
  /** References an existing Asset Management inventory item being listed for sale. */
  assetItemId: string;
  assetClassId: string;
  listingPrice: number;
  additionalInfo: string;
  isBoxPackaged: boolean;
  hasCertificationPapers: boolean;
  listedBy: string;
  listingStatus: MarketplaceListingStatus;
  listedAt: string;
  lastUpdatedAt: string;
  totalAvailableQuantity: number;
  totalAvailableCost: number;
  totalSoldQuantity: number;
  totalSoldCost: number;
};

export type CustomerListingStatus = "pending" | "active" | "rejected";

export type CustomerListingType = {
  listingId: string;
  /** References an existing Asset Management inventory item the customer is offering for sale. */
  assetItemId: string;
  assetClassId: string;
  customerId: string;
  customerName: string;
  unitRetailPrice: number;
  initialLiquidationOffer: number;
  sellerListingPrice: number;
  isBoxPackaged: boolean;
  hasCertificationPapers: boolean;
  listingStatus: CustomerListingStatus;
  /** Labeled "Date Uploaded" while pending, "Date Listed" once active. */
  submittedAt: string;
  lastUpdatedAt: string;
};

/** Shared by every review-and-approve flow in Marketplace (Liquidation Offers, Buy Offers, ...). */
export type OfferStatus = "pending" | "approved" | "rejected";

export type LiquidationOfferType = {
  offerId: string;
  orderId: string;
  /** References an existing Asset Management inventory item the seller is offering to liquidate. */
  assetItemId: string;
  assetClassId: string;
  sellerId: string;
  sellerName: string;
  initialLiquidationOffer: number;
  sellerOffer: number;
  status: OfferStatus;
  submittedAt: string;
  /** Set once the offer is approved or rejected; unset (rendered as "-") while pending. */
  resolvedAt?: string;
  rejectionReason?: string;
};

export type P2PTradeStatus = "in-progress" | "completed" | "cancelled";

export type P2PTradeRequestType = {
  tradeId: string;
  orderId: string;
  /** References an existing Asset Management inventory item being traded between two customers. */
  assetItemId: string;
  assetClassId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  initialListedOffer: number;
  /** The price both parties agreed on — shown as "Locked Price" in the trades table. */
  sellerAcceptedOffer: number;
  status: P2PTradeStatus;
  submittedAt: string;
  /** Set once the trade is completed or cancelled; unset while in progress. */
  resolvedAt?: string;
  rejectionReason?: string;
};

export type MarketplaceAuditLogAction =
  | "Approved Buy"
  | "Approved Sell"
  | "Listed Asset"
  | "Unlisted Asset"
  | "Approved Listing";

export type MarketplaceAuditLogEntry = {
  logId: string;
  assetId: string;
  action: MarketplaceAuditLogAction;
  actionTimestampLabel: string;
  actionDateLabel: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
};

export type BuyOfferType = {
  offerId: string;
  orderId: string;
  /** References an existing Asset Management inventory item (a LuxFi listing) the customer wants to buy. */
  assetItemId: string;
  assetClassId: string;
  buyerId: string;
  buyerName: string;
  listingPrice: number;
  buyOfferPrice: number;
  status: OfferStatus;
  submittedAt: string;
  /** Set once the offer is approved or rejected; unset (rendered as "-") while pending. */
  resolvedAt?: string;
  rejectionReason?: string;
};
