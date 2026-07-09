import { TrendBadge } from "@/components/dashboard/trend-badge";
import { cn } from "@/lib/utils";

export type PairedMetric = {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "negative";
  period?: string;
};

export function PairedMetricCard({
  left,
  right,
  className,
}: {
  left: PairedMetric;
  right: PairedMetric;
  className?: string;
}) {
  return (
    <article className={cn("rounded-2xl bg-primary-white p-4 md:p-5", className)}>
      <div className="grid gap-4 md:grid-cols-2 md:gap-0">
        <div className="min-w-0 md:pr-5">
          <p className="text-sm font-semibold text-text-grey">{left.title}</p>
          <p className="mt-2 whitespace-nowrap text-lg font-semibold text-text-black">{left.value}</p>
          <TrendBadge trend={left.trend} tone={left.tone} period={left.period} />
        </div>

        <div className="min-w-0 md:border-l md:border-primary-grey-stroke md:pl-5">
          <p className="text-sm font-semibold text-text-grey">{right.title}</p>
          <p className="mt-2 whitespace-nowrap text-lg font-semibold text-text-black">{right.value}</p>
          <TrendBadge trend={right.trend} tone={right.tone} period={right.period} />
        </div>
      </div>
    </article>
  );
}
