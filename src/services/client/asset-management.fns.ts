import {
  AssetCategoriesResponseType,
  AssetClassesResponseType,
  AssetClassTypesResponseType,
  AssetQuickSearchResponseType,
  AssetsResponseType,
  AssetVerificationLogDetailsResponseType,
  AssetVerificationLogsResponseType,
  CreateAssetClassResponseType,
  CustomerOwnershipAggregatesResponseType,
  ValuationProvidersResponseType,
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

export const fetchAssets = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetsResponseType>(
    `${AssetManagementRoute.assets}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchAssetQuickSearch = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetQuickSearchResponseType>(
    `${AssetManagementRoute.assetsQuickSearch}${query ? `?${query}` : ""}`,
  );

  return data;
};

// Defaults to a large perPage since the endpoint is paginated but callers
// (the valuation provider dropdown) need the full list — see
// docs/STATUS.md.
export const fetchValuationProviders = async (query: string = "perPage=100") => {
  const { data } = await apiHandler.get<ValuationProvidersResponseType>(
    `${AssetManagementRoute.valuationProviders}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchVerificationLogs = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetVerificationLogsResponseType>(
    `${AssetManagementRoute.verificationLogs}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchVerificationLogDetails = async (logId: string) => {
  const { data } = await apiHandler.get<AssetVerificationLogDetailsResponseType>(
    AssetManagementRoute.verificationLog(logId),
  );

  return data;
};

export const fetchCustomerOwnershipAggregates = async (query: string = "") => {
  const { data } = await apiHandler.get<CustomerOwnershipAggregatesResponseType>(
    `${AssetManagementRoute.customerOwnershipAggregates}${query ? `?${query}` : ""}`,
  );

  return data;
};
