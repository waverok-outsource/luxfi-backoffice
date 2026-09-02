import { useQuery } from "@tanstack/react-query";
import {
  fetchAssetCategories,
  fetchAssetClassDetails,
  fetchAssetClasses,
  fetchAssetClassTypes,
  fetchAssetQuickSearch,
  fetchAssets,
  fetchCustomerOwnershipAggregates,
  fetchValuationProviders,
  fetchVerificationLogDetails,
  fetchVerificationLogs,
} from "@/services/client/asset-management.fns";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import keyFactory from "@/util/query-key-factory";

export const useAssetClasses = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.classes.list(query),
    queryFn: () => fetchAssetClasses(query),
  });

export const useAssetClassDetails = (classId: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.classes.details(classId),
    queryFn: () => fetchAssetClassDetails(classId),
    enabled: !!classId,
  });

export const useAssetClassTypes = () =>
  useQuery({
    queryKey: keyFactory.assetManagement.classes.types,
    queryFn: () => fetchAssetClassTypes(),
  });

export const useAssetCategories = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.categories.list(query),
    queryFn: () => fetchAssetCategories(query),
  });

export const useAssets = (query: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.assetManagement.assets.list(query),
    queryFn: () => fetchAssets(query),
    enabled,
  });

export const useAssetQuickSearch = (query: string, valuatorName: string, page: number) =>
  useQuery({
    queryKey: keyFactory.assetManagement.assets.quickSearch(query, valuatorName, page),
    queryFn: () =>
      fetchAssetQuickSearch(convertObjectToQuery({ query, valuatorName, page: String(page) })),
    enabled: query.trim().length > 0,
  });

export const useValuationProviders = () =>
  useQuery({
    queryKey: keyFactory.assetManagement.valuationProviders.list("perPage=100"),
    queryFn: () => fetchValuationProviders(),
  });

export const useVerificationLogs = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.verificationLogs.list(query),
    queryFn: () => fetchVerificationLogs(query),
  });

export const useVerificationLogDetails = (logId: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.verificationLogs.details(logId),
    queryFn: () => fetchVerificationLogDetails(logId),
    enabled: Boolean(logId),
  });

export const useCustomerOwnershipAggregates = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.customerOwnershipAggregates.list(query),
    queryFn: () => fetchCustomerOwnershipAggregates(query),
  });
