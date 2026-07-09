import { useQuery } from "@tanstack/react-query";
import { fetchAssetClasses } from "@/services/client/asset-management.fns";
import keyFactory from "@/util/query-key-factory";

export const useAssetClasses = (query: string) =>
  useQuery({
    queryKey: keyFactory.assetManagement.classes.list(query),
    queryFn: () => fetchAssetClasses(query),
  });
