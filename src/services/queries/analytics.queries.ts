import { useQuery } from "@tanstack/react-query";

import { fetchDashboardAnalytics } from "@/services/client/analytics.fns";
import keyFactory from "@/util/query-key-factory";

export const useDashboardAnalytics = () =>
  useQuery({
    queryKey: keyFactory.analytics.dashboard,
    queryFn: fetchDashboardAnalytics,
  });
