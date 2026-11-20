import apiHandler from "@/services/api-handler";
import KycAccessRoute from "@/services/route/kyc-access.route";
import type {
  KycAccessResourcesResponse,
  KycAccessRuleResponse,
  KycAccessRulesResponse,
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
