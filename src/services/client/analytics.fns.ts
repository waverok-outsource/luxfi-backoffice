import type { DashboardAnalyticsResponseType } from "@/types/analytics.type";
import apiHandler from "../api-handler";
import AnalyticsRoute from "../route/analytics.route";

export const fetchDashboardAnalytics = async () => {
  const { data } = await apiHandler.get<DashboardAnalyticsResponseType>(AnalyticsRoute.dashboard);
  return data;
};
