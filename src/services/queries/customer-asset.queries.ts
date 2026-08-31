import { useQuery } from "@tanstack/react-query";

import { fetchCustomerAssets, fetchCustomerPortfolioAggregate } from "@/services/client/customer-asset.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerAssets = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.customerAssets.list(customerId, query),
    queryFn: () => fetchCustomerAssets(customerId, query),
    enabled: Boolean(customerId),
  });

export const useCustomerPortfolioAggregate = (customerId: string, assetType: string) =>
  useQuery({
    queryKey: keyFactory.customerAssets.aggregate(customerId, assetType),
    queryFn: () => fetchCustomerPortfolioAggregate(customerId, assetType),
    enabled: Boolean(customerId) && Boolean(assetType),
  });
