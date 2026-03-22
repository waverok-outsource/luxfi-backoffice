"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  featuredMetrics,
  loanCollateralTrend,
  riskExposureShares,
  summaryMetrics,
} from "@/module/dashboard/risk-management/data";
import { RiskManagementExposureList } from "@/module/dashboard/risk-management/components/risk-management-exposure-list";
import { RiskManagementLtvChart } from "@/module/dashboard/risk-management/components/risk-management-ltv-chart";
import { RiskManagementMetrics } from "@/module/dashboard/risk-management/components/risk-management-metrics";

export function RiskManagementDashboard() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Risk Management"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

      <RiskManagementMetrics
        featuredMetrics={featuredMetrics}
        summaryMetrics={summaryMetrics}
      />

      <div className="grid gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
        <RiskManagementExposureList items={riskExposureShares} />
        <RiskManagementLtvChart data={loanCollateralTrend} />
      </div>
    </div>
  );
}
