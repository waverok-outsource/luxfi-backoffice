"use client";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { GrowthMarketingLocationDistribution } from "@/module/dashboard/growth-marketing/components/growth-marketing-location-distribution";
import { GrowthMarketingMetrics } from "@/module/dashboard/growth-marketing/components/growth-marketing-metrics";
import { GrowthMarketingUserGrowthTrend } from "@/module/dashboard/growth-marketing/components/growth-marketing-user-growth-trend";
import {
  splitGrowthMarketingMetrics,
  toLocationShares,
  toUserGrowthTrend,
} from "@/module/dashboard/growth-marketing/data";
import { useGrowthMarketingOverview } from "@/services/queries/growth-marketing.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type GrowthMarketingQuery = {
  from?: string;
  to?: string;
};

export function GrowthMarketingDashboard() {
  const { value } = useURLQuery<GrowthMarketingQuery>();

  const overviewQuery = convertObjectToQuery({
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data, isLoading } = useGrowthMarketingOverview(overviewQuery);

  const { featuredMetrics, summaryMetrics } = splitGrowthMarketingMetrics(
    data?.kpis.metrics ?? [],
    isLoading,
  );
  const locationShares = toLocationShares(data?.customerDistribution.distribution ?? []);
  const userGrowthTrend = toUserGrowthTrend(data?.userGrowth.points ?? []);
  const totalUsersLabel = `${(data?.userGrowth.totalUsers ?? 0).toLocaleString()} Total Users`;

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Growth & Marketing"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar resetPageOnChange={false} />

      <GrowthMarketingMetrics
        featuredMetrics={featuredMetrics}
        summaryMetrics={summaryMetrics}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <GrowthMarketingLocationDistribution locations={locationShares} />
        <GrowthMarketingUserGrowthTrend
          data={userGrowthTrend}
          totalUsersLabel={totalUsersLabel}
        />
      </div>
    </div>
  );
}
