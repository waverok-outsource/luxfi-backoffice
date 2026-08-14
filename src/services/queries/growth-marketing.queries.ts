import { useQuery } from "@tanstack/react-query";

import {
  fetchGrowthMarketingCustomerDistribution,
  fetchGrowthMarketingMetrics,
  fetchGrowthMarketingOverview,
  fetchGrowthMarketingUserGrowth,
} from "@/services/client/growth-marketing.fns";
import keyFactory from "@/util/query-key-factory";

export const useGrowthMarketingOverview = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.growthMarketing.overview(query),
    queryFn: () => fetchGrowthMarketingOverview(query),
  });

export const useGrowthMarketingMetrics = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.growthMarketing.metrics(query),
    queryFn: () => fetchGrowthMarketingMetrics(query),
  });

export const useGrowthMarketingCustomerDistribution = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.growthMarketing.customerDistribution(query),
    queryFn: () => fetchGrowthMarketingCustomerDistribution(query),
  });

export const useGrowthMarketingUserGrowth = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.growthMarketing.userGrowth(query),
    queryFn: () => fetchGrowthMarketingUserGrowth(query),
  });
