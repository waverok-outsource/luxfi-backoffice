import { ApiResponse } from "@/types/global";
import {
  PortfolioAnalyticsType,
  PortfolioAssetBrandsResponseType,
  PortfolioAssetCategoriesResponseType,
  PortfolioInventoryAssetsResponseType,
} from "@/types/portfolio.type";
import apiHandler from "../api-handler";
import PortfolioRoute from "../route/portfolio.route";

export const fetchPortfolioAnalytics = async () => {
  const { data } = await apiHandler.get<ApiResponse<PortfolioAnalyticsType>>(PortfolioRoute.analytics);

  return data.data;
};

export const fetchPortfolioAssets = async (query: string = "") => {
  const { data } = await apiHandler.get<PortfolioInventoryAssetsResponseType>(
    `${PortfolioRoute.assets}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchPortfolioAssetBrands = async (query: string = "") => {
  const { data } = await apiHandler.get<PortfolioAssetBrandsResponseType>(
    `${PortfolioRoute.assetBrands}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchPortfolioAssetCategories = async (query: string = "") => {
  const { data } = await apiHandler.get<PortfolioAssetCategoriesResponseType>(
    `${PortfolioRoute.assetCategories}${query ? `?${query}` : ""}`,
  );

  return data;
};
