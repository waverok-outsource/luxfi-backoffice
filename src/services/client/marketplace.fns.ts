import type {
  AssetMarketListingsResponseType,
  OrderDetailsResponseType,
  OrdersListResponseType,
} from "@/types/marketplace.type";
import apiHandler from "../api-handler";
import MarketplaceRoute from "../route/marketplace.route";

export const fetchAssetMarketListings = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetMarketListingsResponseType>(
    `${MarketplaceRoute.assetMarket}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchOrders = async (query: string = "") => {
  const { data } = await apiHandler.get<OrdersListResponseType>(
    `${MarketplaceRoute.orders}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchOrderById = async (orderId: string) => {
  const { data } = await apiHandler.get<OrderDetailsResponseType>(`${MarketplaceRoute.orders}/${orderId}`);

  return data;
};
