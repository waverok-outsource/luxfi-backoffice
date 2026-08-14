import { StatCard } from "@/components/dashboard/stat-card";

export type HelpSupportMetric = {
  title: string;
  value: string;
  isLoading?: boolean;
};

export function HelpSupportMetrics({ metrics }: { metrics: HelpSupportMetric[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} valueClassName="whitespace-nowrap" />
      ))}
    </div>
  );
}
