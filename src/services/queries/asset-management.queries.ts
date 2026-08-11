import { useQuery } from "@tanstack/react-query";
import {
  fetchAssetCategories,
  fetchAssetClassDetails,
  fetchAssetClasses,
  fetchAssetClassTypes,
  fetchAssetQuickSearch,
  fetchAssets,
  fetchValuationProviders,
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

export const useAssets = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.assets.list(query),
    queryFn: () => fetchAssets(query),
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
