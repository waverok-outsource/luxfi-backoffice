import { useQuery } from "@tanstack/react-query";

import {
  fetchKycAccessEndpoints,
  fetchKycAccessResources,
  fetchKycAccessRule,
  fetchKycAccessRules,
  fetchKycAccessTiers,
} from "@/services/client/kyc-access.fns";
import keyFactory from "@/util/query-key-factory";

export const useKycAccessRules = (query: string) =>
  useQuery({
    queryKey: keyFactory.kyc.access.list(query),
    queryFn: () => fetchKycAccessRules(query),
  });

export const useKycAccessRule = (ruleId: string) =>
  useQuery({
    queryKey: keyFactory.kyc.access.details(ruleId),
    queryFn: () => fetchKycAccessRule(ruleId),
    enabled: Boolean(ruleId),
  });

export const useKycAccessResources = () =>
  useQuery({
    queryKey: keyFactory.kyc.access.resources,
    queryFn: fetchKycAccessResources,
  });

export const useKycAccessEndpoints = () =>
  useQuery({
    queryKey: keyFactory.kyc.access.endpoints,
    queryFn: fetchKycAccessEndpoints,
  });

export const useKycAccessTiers = (query: string) =>
  useQuery({
    queryKey: keyFactory.kyc.access.tiers(query),
    queryFn: () => fetchKycAccessTiers(query),
  });
