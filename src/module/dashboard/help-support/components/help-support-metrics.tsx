import { StatCard } from "@/components/dashboard/stat-card";
import type { HelpSupportMetric } from "@/module/dashboard/help-support/data";

export function HelpSupportMetrics({ metrics }: { metrics: HelpSupportMetric[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} valueClassName="whitespace-nowrap" />
      ))}
    </div>
  );
}
