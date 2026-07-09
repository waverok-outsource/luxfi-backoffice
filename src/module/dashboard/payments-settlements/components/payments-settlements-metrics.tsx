import { PairedMetricCard } from "@/components/dashboard/paired-metric-card";
import { StatCard } from "@/components/dashboard/stat-card";

import type { PaymentsMetric } from "@/module/dashboard/payments-settlements/data";

type TradeMetric = {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "negative";
};

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
      <PairedMetricCard
        left={assetTradeSummary.sales}
        right={assetTradeSummary.purchases}
        className="md:col-span-2 xl:col-span-1"
      />
      <StatCard {...walletMetric} valueClassName="whitespace-nowrap" />
      <StatCard {...interestMetric} valueClassName="whitespace-nowrap" />
    </div>
  );
}
