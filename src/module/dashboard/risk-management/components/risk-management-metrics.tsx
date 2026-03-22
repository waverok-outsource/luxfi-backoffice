import { StatCard } from "@/components/dashboard/stat-card";
import type { RiskManagementMetric } from "@/module/dashboard/risk-management/data";

export function RiskManagementMetrics({
  featuredMetrics,
  summaryMetrics,
}: {
  featuredMetrics: RiskManagementMetric[];
  summaryMetrics: RiskManagementMetric[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {featuredMetrics.map((metric) => (
          <StatCard key={metric.title} {...metric} featured />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryMetrics.map((metric) => (
          <StatCard key={metric.title} {...metric} className="p-4" />
        ))}
      </div>
    </div>
  );
}
