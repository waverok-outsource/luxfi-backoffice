"use client";

import { DashboardFilters } from "@/module/dashboard/home/components/dashboard-filters";
import { HomeActivityRiskSection } from "@/module/dashboard/home/components/home-activity-risk-section";
import { HomeOverviewSection } from "@/module/dashboard/home/components/home-overview-section";
import { HomeTrendInventorySection } from "@/module/dashboard/home/components/home-trend-inventory-section";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { useDashboardAnalytics } from "@/services/queries/analytics.queries";

export function HomeDashboard() {
  const { data: analyticsResponse, isLoading } = useDashboardAnalytics();
  const analytics = analyticsResponse?.data;

  return (
    <>
      <div className="mb-4 pb-2">
        <DashboardPageHeader
          title="Home"
          description="Real time analytics and overview at a glance"
        />
      </div>

      <DashboardFilters />

      <HomeOverviewSection
        metrics={analytics?.metrics}
        liquidityPool={analytics?.liquidityPool}
        isLoading={isLoading}
      />
      <HomeActivityRiskSection
        activities={analytics?.activities ?? []}
        riskAlarms={analytics?.riskAlarms ?? []}
        isLoading={isLoading}
      />
      <HomeTrendInventorySection
        loanGraph={analytics?.loanGraph ?? []}
        assetBrands={analytics?.assetBrands ?? []}
        isLoading={isLoading}
      />
    </>
  );
}
