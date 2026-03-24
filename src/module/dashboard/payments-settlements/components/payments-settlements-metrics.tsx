import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";

import type { PaymentsMetric } from "@/module/dashboard/payments-settlements/data";

type TradeMetric = {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "negative";
};

function TrendBadge({
  trend,
  tone,
  className,
}: {
  trend: string;
  tone: "positive" | "negative";
  className?: string;
}) {
  const isNegative = tone === "negative";

  return (
    <Badge
      variant={isNegative ? "error" : "active"}
      className={cn("mt-3 gap-1.5 px-2 py-1", className)}
    >
      <span>{trend}</span>
      <Triangle className={cn("h-2.5 w-2.5 fill-current", isNegative && "rotate-180")} />
    </Badge>
  );
}

function AssetTradeCard({
  sales,
  purchases,
  className,
}: {
  sales: TradeMetric;
  purchases: TradeMetric;
  className?: string;
}) {
  return (
    <article className={cn("rounded-2xl bg-primary-white p-4 md:p-5", className)}>
      <div className="grid gap-4 md:grid-cols-2 md:gap-0">
        <div className="min-w-0 md:pr-5">
          <p className="text-sm font-semibold text-text-grey">{sales.title}</p>
          <p className="mt-2 whitespace-nowrap text-lg font-semibold text-text-black">
            {sales.value}
          </p>
          <TrendBadge trend={sales.trend} tone={sales.tone} />
        </div>

        <div className="min-w-0 md:border-l md:border-primary-grey-stroke md:pl-5">
          <p className="text-sm font-semibold text-text-grey">{purchases.title}</p>
          <p className="mt-2 whitespace-nowrap text-lg font-semibold text-text-black">
            {purchases.value}
          </p>
          <TrendBadge trend={purchases.trend} tone={purchases.tone} />
        </div>
      </div>
    </article>
  );
}

export function PaymentsSettlementsMetrics({
  leadingMetrics,
  trailingMetrics,
  assetTradeSummary,
}: {
  leadingMetrics: PaymentsMetric[];
  trailingMetrics: PaymentsMetric[];
  assetTradeSummary: {
    sales: TradeMetric;
    purchases: TradeMetric;
  };
}) {
  const [inflowMetric, outflowMetric] = leadingMetrics;
  const [walletMetric, interestMetric] = trailingMetrics;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <StatCard {...inflowMetric} valueClassName="whitespace-nowrap" />
      <StatCard
        {...outflowMetric}
        valueClassName="whitespace-nowrap text-text-red"
      />
      <AssetTradeCard
        sales={assetTradeSummary.sales}
        purchases={assetTradeSummary.purchases}
        className="md:col-span-2 xl:col-span-1"
      />
      <StatCard {...walletMetric} valueClassName="whitespace-nowrap" />
      <StatCard {...interestMetric} valueClassName="whitespace-nowrap" />
    </div>
  );
}
