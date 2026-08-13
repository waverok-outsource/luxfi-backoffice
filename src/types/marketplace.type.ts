import { ApiResponse, PaginatedApiResponse } from "./global";

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

// Buy Offers' real backend resource — GET /v1/orders (and /v1/orders/:orderId), a materially
// different, multi-item shape from the asset-market listings above. Reviewed as a whole order
// (not per item) via PATCH /v1/orders/:orderId/review. See ADR 0018 and its follow-up.
export type OrderItemType = {
  _id: string;
  userId: string;
  orderId: string;
  listingId: string;
  sellerId: string;
  itemId: string;
  assetRefId: string;
  title: string;
  image: string;
  currencyCode: string;
  itemType: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  /** Present on GET /v1/orders/:orderId in practice, though absent from the sampled Postman body. */
  seller: OrderItemSellerType;
};

export type OrderItemSellerType = {
  id: string;
  name: string;
  email: string;
};

export type OrderBuyerType = {
  id: string;
  name: string;
  email: string;
};

export type OrderType = {
  reference: string;
  totalCost: number;
  fee: number;
  itemCost: number;
  settled: boolean;
  paid: boolean;
  status: string;
  paymentMethod: string;
  paymentChannel: string;
  createdAt: string;
  items: OrderItemType[];
  orderId: string;
  paymentStatus: string;
  itemCount: number;
  /** Present live on GET /v1/orders, though absent from the sampled Postman body. */
  buyer: OrderBuyerType;
};

export type OrderDetailsType = {
  logId: string;
  orderId: string;
  reference: string;
  transactionDate: string;
  paymentMethod: string;
  paymentChannel: string;
  saleValue: number;
  totalCost: number;
  fee: number;
  status: string;
  /** Lowercase machine status — use this for pending-state checks, not `status` (capitalized display text on this endpoint). */
  statusRaw: string;
  paid: boolean;
  settled: boolean;
  buyer: OrderBuyerType;
  items: OrderItemType[];
};

export type OrdersListResponseType = PaginatedApiResponse<OrderType[]>;

export type OrderDetailsResponseType = ApiResponse<OrderDetailsType>;

export type ReviewOrderPayloadType = {
  status: "approved" | "rejected";
  /** Reject reason (or any note) — unlike the asset-market review endpoint, this one accepts it. */
  note?: string;
};

// ASSUMPTION: response shape not sampled by backend; mirrors the order-details shape. See ADR 0018.
export type ReviewOrderResponseType = ApiResponse<OrderDetailsType>;
