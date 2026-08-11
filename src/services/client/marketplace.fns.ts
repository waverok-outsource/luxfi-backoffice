import type { AssetMarketListingsResponseType } from "@/types/marketplace.type";
import apiHandler from "../api-handler";
import MarketplaceRoute from "../route/marketplace.route";

export const fetchAssetMarketListings = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetMarketListingsResponseType>(
    `${MarketplaceRoute.assetMarket}${query ? `?${query}` : ""}`,
  );

  return data;
};
