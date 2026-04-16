"use client";

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
  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Risk Management"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar resetPageOnChange={false} />

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
