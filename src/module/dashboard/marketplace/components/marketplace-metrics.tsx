import { PairedMetricCard } from "@/components/dashboard/paired-metric-card";
import type { AnalyticsStatCardType } from "@/util/analytics-metrics";

type MarketplaceMetricsProps = {
  pairs: [AnalyticsStatCardType, AnalyticsStatCardType][];
};

export function MarketplaceMetrics({ pairs }: MarketplaceMetricsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {pairs.map(([left, right]) => (
        <PairedMetricCard key={left.title} left={left} right={right} />
      ))}
    </div>
  );
}
