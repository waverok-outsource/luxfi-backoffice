import apiHandler from "@/services/api-handler";
import KycAccessRoute from "@/services/route/kyc-access.route";
import type {
  KycAccessEndpointsResponse,
  KycAccessResourcesResponse,
  KycAccessRuleResponse,
  KycAccessRulesResponse,
  KycTiersResponse,
} from "@/types/kyc.type";

export const fetchKycAccessRules = async (query = "") => {
  const { data } = await apiHandler.get<KycAccessRulesResponse>(
    `${KycAccessRoute.rules}${query ? `?${query}` : ""}`,
  );
  return data;
};

export const fetchKycAccessRule = async (ruleId: string) => {
  const { data } = await apiHandler.get<KycAccessRuleResponse>(KycAccessRoute.rule(ruleId));
  return data;
};

export const fetchKycAccessResources = async () => {
  const { data } = await apiHandler.get<KycAccessResourcesResponse>(KycAccessRoute.resources);
  return data;
};

export const fetchKycAccessEndpoints = async () => {
  const { data } = await apiHandler.get<KycAccessEndpointsResponse>(KycAccessRoute.endpoints);
  return data;
};

export const fetchKycAccessTiers = async (query = "") => {
  const { data } = await apiHandler.get<KycTiersResponse>(
    `${KycAccessRoute.tiers}${query ? `?${query}` : ""}`,
  );
  return data;
};
