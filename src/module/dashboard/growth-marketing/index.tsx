"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  featuredMetrics,
  locationShares,
  summaryMetrics,
  totalUsersLabel,
  userGrowthTrend,
} from "@/module/dashboard/growth-marketing/data";
import { GrowthMarketingLocationDistribution } from "@/module/dashboard/growth-marketing/components/growth-marketing-location-distribution";
import { GrowthMarketingMetrics } from "@/module/dashboard/growth-marketing/components/growth-marketing-metrics";
import { GrowthMarketingUserGrowthTrend } from "@/module/dashboard/growth-marketing/components/growth-marketing-user-growth-trend";

export function GrowthMarketingDashboard() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Growth & Marketing"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

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
