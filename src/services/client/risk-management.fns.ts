import type {
  RiskManagementAnalyticsResponseType,
  RiskManagementSummaryResponseType,
} from "@/types/risk-management.type";
import apiHandler from "../api-handler";
import RiskManagementRoute from "../route/risk-management.route";

export const fetchRiskManagementSummary = async () => {
  const { data } = await apiHandler.get<RiskManagementSummaryResponseType>(
    RiskManagementRoute.summary,
  );
  return data;
};

export const fetchRiskManagementAnalytics = async () => {
  const { data } = await apiHandler.get<RiskManagementAnalyticsResponseType>(
    RiskManagementRoute.analytics,
  );
  return data;
};
