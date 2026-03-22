import { StatCard } from "@/components/dashboard/stat-card";
import type { GrowthMarketingMetric } from "@/module/dashboard/growth-marketing/data";

export function GrowthMarketingMetrics({
  featuredMetrics,
  summaryMetrics,
}: {
  featuredMetrics: GrowthMarketingMetric[];
  summaryMetrics: GrowthMarketingMetric[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {featuredMetrics.map((metric) => (
          <StatCard key={metric.title} {...metric} featured />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {summaryMetrics.map((metric) => (
          <StatCard key={metric.title} {...metric} className="p-4" />
        ))}
      </div>
    </div>
  );
}
