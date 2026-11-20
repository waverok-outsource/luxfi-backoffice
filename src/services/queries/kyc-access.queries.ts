import { useQuery } from "@tanstack/react-query";

import {
  fetchKycAccessResources,
  fetchKycAccessRule,
  fetchKycAccessRules,
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
