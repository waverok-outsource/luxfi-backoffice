import { CardSectionHeader } from "@/components/dashboard/card-section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { LiquidityPieChart } from "@/module/dashboard/home/components/liquidity-pie-chart";
import type { DashboardAnalyticsType, LiquidityPoolItem, MetricValue } from "@/types/analytics.type";
import LiquidityIcon from "./icons/liquidity";

type Props = {
  metrics: DashboardAnalyticsType["metrics"] | undefined;
  liquidityPool: DashboardAnalyticsType["liquidityPool"] | undefined;
  isLoading: boolean;
};

function metricTone(
  direction: "up" | "down" | "flat",
  isGoodWhenUp: boolean,
): "positive" | "negative" {
  if (direction === "flat") return "positive";
  return direction === "up" === isGoodWhenUp ? "positive" : "negative";
}

function metricCard(
  title: string,
  metric: MetricValue | undefined,
  isLoading: boolean,
  isGoodWhenUp = true,
) {
  if (isLoading || !metric) {
    return {
      title,
      value: "--",
      trend: undefined,
      period: undefined,
      tone: "positive" as const,
      isLoading,
    };
  }
  return {
    title,
    value: metric.displayValue,
    trend: metric.trend.displayValue,
    period: metric.trend.period,
    tone: metricTone(metric.trend.direction, isGoodWhenUp),
  };
}

const FALLBACK_LIQUIDITY: LiquidityPoolItem[] = [
  { currencyCode: "USDC", balance: 0, displayValue: "$0", percentage: 50, percentageDisplay: "50%" },
  { currencyCode: "USDT", balance: 0, displayValue: "$0", percentage: 50, percentageDisplay: "50%" },
];

export function HomeOverviewSection({ metrics, liquidityPool, isLoading }: Props) {
  const m = metrics;
  const statCards = [
    metricCard("Total Inflow", m?.inflow, isLoading),
    metricCard("Total Outflow", m?.outflow, isLoading, false),
    metricCard("Total Assets Inventory", m?.assets, isLoading),
    metricCard("Total Customers", m?.customers, isLoading),
    metricCard("Verified Customers", m?.verifiedCustomers, isLoading),
    metricCard("Total Loan Disbursed", m?.loanDisbursed, isLoading),
    metricCard("Total Loan Repaid", m?.loanRepayment, isLoading),
    metricCard("Active Loans", m?.activeLoans, isLoading),
    metricCard("Near Liquidations", m?.nearLiquidations, isLoading, false),
  ];

  const liquidityItems = liquidityPool?.items?.length ? liquidityPool.items : FALLBACK_LIQUIDITY;

  return (
    <div className="mb-4 grid gap-3 xl:grid-cols-[1.15fr_2.2fr]">
      <div className="rounded-2xl bg-primary-white p-4">
        <CardSectionHeader title="Total Liquidity Pool" icon={<LiquidityIcon />} />
        <LiquidityPieChart items={liquidityItems} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
