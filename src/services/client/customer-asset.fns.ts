import type { CustomerPortfolioAggregateResponseType } from "@/types/asset-management.type";
import type { CustomerAssetsResponseType } from "@/types/customer-asset.type";
import apiHandler from "../api-handler";
import CustomerAssetRoute from "../route/customer-asset.route";

export const fetchCustomerAssets = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<CustomerAssetsResponseType>(
    `${CustomerAssetRoute.assets(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchCustomerPortfolioAggregate = async (customerId: string, assetType: string) => {
  const { data } = await apiHandler.get<CustomerPortfolioAggregateResponseType>(
    CustomerAssetRoute.aggregate(customerId, assetType),
  );

  return data;
};
