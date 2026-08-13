"use client";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import type { RiskExposureShare, RiskManagementMetric, RiskTrendPoint } from "@/module/dashboard/risk-management/data";
import { RiskManagementExposureList } from "@/module/dashboard/risk-management/components/risk-management-exposure-list";
import { RiskManagementLtvChart } from "@/module/dashboard/risk-management/components/risk-management-ltv-chart";
import { RiskManagementMetrics } from "@/module/dashboard/risk-management/components/risk-management-metrics";
import { useRiskManagementAnalytics, useRiskManagementSummary } from "@/services/queries/risk-management.queries";

const EXPOSURE_COLORS = ["#2B6B4D", "#3FA16F", "#4FB685", "#5BC191", "#7FE0A7", "#A4E8C1", "#C8F5DA"];

function tone(
  direction: "up" | "down" | "flat",
  isGoodWhenUp: boolean,
): "positive" | "negative" {
  if (direction === "flat") return "positive";
  return direction === "up" === isGoodWhenUp ? "positive" : "negative";
}

export function RiskManagementDashboard() {
  const { data: summaryResponse, isLoading: summaryLoading } = useRiskManagementSummary();
  const { data: analyticsResponse, isLoading: analyticsLoading } = useRiskManagementAnalytics();

  const summary = summaryResponse?.data;
  const analytics = analyticsResponse?.data;

  const loading = summaryLoading || analyticsLoading;

  const featuredMetrics: RiskManagementMetric[] = summary
    ? [
        {
          title: "Average Portfolio LTV",
          value: summary.averagePortfolioLtv.displayValue,
          trend: summary.averagePortfolioLtv.trend.displayValue,
          tone: tone(summary.averagePortfolioLtv.trend.direction, false),
        },
        {
          title: `Loans (> ${summary.highLtvThreshold}%) LTV`,
          value: summary.highLtvLoans.displayValue,
          trend: summary.highLtvLoans.trend.displayValue,
          tone: tone(summary.highLtvLoans.trend.direction, false),
        },
      ]
    : [
        { title: "Average Portfolio LTV", value: loading ? "…" : "-", trend: "", tone: "positive" },
        { title: "Loans (> 70%) LTV", value: loading ? "…" : "-", trend: "", tone: "negative" },
      ];

  const summaryMetrics: RiskManagementMetric[] = summary
    ? [
        {
          title: "Liquidation Triggered",
          value: summary.liquidationTriggered.displayValue,
          trend: summary.liquidationTriggered.trend.displayValue,
          tone: tone(summary.liquidationTriggered.trend.direction, false),
        },
        {
          title: "Capital At Risk",
          value: summary.capitalAtRisk.displayValue,
          trend: summary.capitalAtRisk.trend.displayValue,
          tone: tone(summary.capitalAtRisk.trend.direction, false),
        },
        {
          title: "Coverage Ratio After Liquidation",
          value: summary.coverageRatioAfterLiquidation.displayValue,
          trend: summary.coverageRatioAfterLiquidation.trend.displayValue,
          tone: tone(summary.coverageRatioAfterLiquidation.trend.direction, true),
        },
      ]
    : [
        { title: "Liquidation Triggered", value: loading ? "…" : "-", trend: "", tone: "positive" },
        { title: "Capital At Risk", value: loading ? "…" : "-", trend: "", tone: "positive" },
        { title: "Coverage Ratio After Liquidation", value: loading ? "…" : "-", trend: "", tone: "positive" },
      ];

  const riskExposureShares: RiskExposureShare[] = (analytics?.assetExposure ?? []).map(
    (item, i) => ({
      label: item.assetName,
      percent: item.exposure,
      color: EXPOSURE_COLORS[i % EXPOSURE_COLORS.length],
    }),
  );

  const loanCollateralTrend: RiskTrendPoint[] = (analytics?.collateralToValue ?? []).map(
    (item) => ({
      month: item.month,
      loanValue: item.loanValue,
      collateralValue: item.collateralValue,
    }),
  );

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
