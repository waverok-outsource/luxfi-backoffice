import { ApiResponse } from "@/types/global";
import {
  GrowthMarketingCustomerDistributionType,
  GrowthMarketingMetricsType,
  GrowthMarketingOverviewType,
  GrowthMarketingUserGrowthType,
} from "@/types/growth-marketing.type";
import apiHandler from "../api-handler";
import GrowthMarketingRoute from "../route/growth-marketing.route";

export const fetchGrowthMarketingOverview = async (query: string = "") => {
  const { data } = await apiHandler.get<ApiResponse<GrowthMarketingOverviewType>>(
    `${GrowthMarketingRoute.overview}${query ? `?${query}` : ""}`,
  );

  return data.data;
};

export const fetchGrowthMarketingMetrics = async (query: string = "") => {
  const { data } = await apiHandler.get<ApiResponse<GrowthMarketingMetricsType>>(
    `${GrowthMarketingRoute.metrics}${query ? `?${query}` : ""}`,
  );

  return data.data;
};

export const fetchGrowthMarketingCustomerDistribution = async (query: string = "") => {
  const { data } = await apiHandler.get<ApiResponse<GrowthMarketingCustomerDistributionType>>(
    `${GrowthMarketingRoute.customerDistribution}${query ? `?${query}` : ""}`,
  );

  return data.data;
};

export const fetchGrowthMarketingUserGrowth = async (query: string = "") => {
  const { data } = await apiHandler.get<ApiResponse<GrowthMarketingUserGrowthType>>(
    `${GrowthMarketingRoute.userGrowth}${query ? `?${query}` : ""}`,
  );

  return data.data;
};
