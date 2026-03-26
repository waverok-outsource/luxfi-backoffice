import { StatCard } from "@/components/dashboard/stat-card";

import type { AssetLoansMetric } from "@/module/dashboard/asset-loans/data";

export function AssetLoanMetrics({ metrics }: { metrics: AssetLoansMetric[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} valueClassName="whitespace-nowrap" />
      ))}
    </div>
  );
}
