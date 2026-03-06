import { DashboardFilters } from "@/module/dashboard/home/components/dashboard-filters";
import { HomeActivityRiskSection } from "@/module/dashboard/home/components/home-activity-risk-section";
import { HomeOverviewSection } from "@/module/dashboard/home/components/home-overview-section";
import { HomeTrendInventorySection } from "@/module/dashboard/home/components/home-trend-inventory-section";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

export function HomeDashboard() {
  return (
    <>
      <div className="mb-4 pb-2">
        <DashboardPageHeader
          title="Home"
          description="Real time analytics and overview at a glance"
        />
      </div>

      <DashboardFilters />

      <HomeOverviewSection />
      <HomeActivityRiskSection />
      <HomeTrendInventorySection />
    </>
  );
}
