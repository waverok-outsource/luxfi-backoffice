import { PairedMetricCard } from "@/components/dashboard/paired-metric-card";
import { marketplaceMetricPairs } from "@/module/dashboard/marketplace/data";

export function MarketplaceMetrics() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {marketplaceMetricPairs.map((pair) => (
        <PairedMetricCard
          key={pair.left.title}
          left={{ ...pair.left, period: "Last 7 days" }}
          right={{ ...pair.right, period: "Last 7 days" }}
        />
      ))}
    </div>
  );
}
