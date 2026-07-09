import { AssetClassesResponseType } from "@/types/asset-management.type";
import apiHandler from "../api-handler";
import AssetManagementRoute from "../route/asset-management.route";

export const fetchAssetClasses = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetClassesResponseType>(
    `${AssetManagementRoute.classes}${query ? `?${query}` : ""}`,
  );

  return data;
};
