import type { CustomerAssetsResponseType } from "@/types/customer-asset.type";
import apiHandler from "../api-handler";
import CustomerAssetRoute from "../route/customer-asset.route";

export const fetchCustomerAssets = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<CustomerAssetsResponseType>(
    `${CustomerAssetRoute.assets(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};
