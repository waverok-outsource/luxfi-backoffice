import { ApiResponse, PaginatedApiResponse } from "./global";

/** Shared by every review-and-approve flow in Marketplace (Liquidation Offers, Buy Offers, ...). */
export type OfferStatus = "pending" | "approved" | "rejected";

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

export type AssetMarketMoney = {
  value: number;
  currencyCode: string;
};

export type AssetMarketListingStatus = "pending" | "approved" | "rejected";

export type AssetMarketAssetDetails = {
  dialColour: string;
  productionYear: string;
  weight: { value: number; unit: string } | null;
  case: { colour: string; size: number; unit: string } | null;
  category: string;
  assetType: string;
  assetId: string;
  assetName: string;
  assetClass: string;
  hasPapers: boolean;
  isBoxed: boolean;
};

export type AssetMarketSeller = {
  name: string;
  email: string;
};

export type AssetMarketListingType = {
  listingId: string;
  title?: string;
  quantity: number;
  listingPrice: AssetMarketMoney;
  listingDate: string;
  listingStatus: AssetMarketListingStatus;
  assetImages: string[];
  seller: AssetMarketSeller;
  lastUpdated: string;
  qtyAvailable: number;
  qtySold: number;
  totalAmountSold: AssetMarketMoney;
  totalAmountRemaining: AssetMarketMoney;
  assetDetails: AssetMarketAssetDetails;
  marketPrice: AssetMarketMoney;
  retailPrice: AssetMarketMoney;
  liquidationPrice: AssetMarketMoney;
};

export type AssetMarketListingsResponseType = PaginatedApiResponse<AssetMarketListingType[]>;

export type CreateAssetMarketListingPayloadType = {
  quantity: number;
  price: { currencyCode: string; value: number };
  assetId: string;
};

// ASSUMPTION: response shape not sampled by backend; mirrors every other
// create-endpoint response in this codebase. See ADR 0018.
export type CreateAssetMarketListingResponseType = ApiResponse<AssetMarketListingType>;

export type ReviewAssetMarketListingPayloadType = {
  status: Extract<AssetMarketListingStatus, "approved" | "rejected">;
};

// ASSUMPTION: response shape not sampled by backend. See ADR 0018.
export type ReviewAssetMarketListingResponseType = ApiResponse<AssetMarketListingType>;
