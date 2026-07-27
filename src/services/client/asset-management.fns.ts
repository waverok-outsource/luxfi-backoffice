import {
  AssetCategoriesResponseType,
  AssetClassesResponseType,
  AssetClassTypesResponseType,
  CreateAssetClassResponseType,
} from "@/types/asset-management.type";
import apiHandler from "../api-handler";
import AssetManagementRoute from "../route/asset-management.route";

export const fetchAssetClasses = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetClassesResponseType>(
    `${AssetManagementRoute.classes}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchAssetClassTypes = async () => {
  const { data } = await apiHandler.get<AssetClassTypesResponseType>(AssetManagementRoute.types);

  return data;
};

export const fetchAssetClassDetails = async (classId: string) => {
  const { data } = await apiHandler.get<CreateAssetClassResponseType>(
    `${AssetManagementRoute.classes}/${classId}`,
  );

  return data;
};

export const fetchAssetCategories = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetCategoriesResponseType>(
    `${AssetManagementRoute.categories}${query ? `?${query}` : ""}`,
  );

  return data;
};
