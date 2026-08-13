import { useQuery } from "@tanstack/react-query";

import {
  fetchRiskManagementAnalytics,
  fetchRiskManagementSummary,
} from "@/services/client/risk-management.fns";
import keyFactory from "@/util/query-key-factory";

export const useRiskManagementSummary = () =>
  useQuery({
    queryKey: keyFactory.riskManagement.summary,
    queryFn: fetchRiskManagementSummary,
  });

export const useRiskManagementAnalytics = () =>
  useQuery({
    queryKey: keyFactory.riskManagement.analytics,
    queryFn: fetchRiskManagementAnalytics,
  });
