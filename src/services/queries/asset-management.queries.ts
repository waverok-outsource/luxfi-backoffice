import { useQuery } from "@tanstack/react-query";
import {
  fetchAssetCategories,
  fetchAssetClassDetails,
  fetchAssetClasses,
  fetchAssetClassTypes,
} from "@/services/client/asset-management.fns";
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
