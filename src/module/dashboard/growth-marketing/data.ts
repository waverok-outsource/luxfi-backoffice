import type {
  GrowthMarketingCountryDistribution,
  GrowthMarketingMetricItem,
  GrowthMarketingUserGrowthPoint,
} from "@/types/growth-marketing.type";
import { toTitleCase } from "@/util/helper";

export type GrowthMetricTone = "positive" | "negative";

export type GrowthMarketingMetric = {
  title: string;
  value: string;
  trend: string;
  period?: string;
  tone: GrowthMetricTone;
  isLoading?: boolean;
};

export type GrowthMarketingLocationShare = {
  country: string;
  percent: number;
  color: string;
};

export type GrowthMarketingTrendPoint = {
  month: string;
  verified: number;
  unverified: number;
};

const FEATURED_METRIC_DEFS = [
  { key: "inflowTransactionCount", title: "Inflow Transaction Count" },
  { key: "outflowTransactionCount", title: "Outflow Transaction Count" },
];

const SUMMARY_METRIC_DEFS = [
  { key: "customerLeads", title: "Customer Leads" },
  { key: "totalSales", title: "Total Sales" },
  { key: "onlinePurchases", title: "Online Purchases" },
  { key: "loanRequests", title: "Loan Requests" },
  { key: "appDownloads", title: "App Downloads" },
  { key: "websiteVisitors", title: "Website Visitors" },
];

const LOCATION_COLORS = [
  "#2B6B4D",
  "#3FA16F",
  "#4FB685",
  "#68C996",
  "#7FE0A7",
  "#86E8B3",
  "#B8F6D0",
];

function toGrowthMarketingMetric(
  def: { key: string; title: string },
  metricsByKey: Map<string, GrowthMarketingMetricItem>,
  isLoading: boolean,
): GrowthMarketingMetric {
  const metric = metricsByKey.get(def.key);

  if (!metric) {
    return { title: def.title, value: "--", trend: "", tone: "positive", isLoading };
  }

  return {
    title: metric.label,
    value: metric.value.toLocaleString(),
    trend: `${Math.abs(metric.percentageChange)}%`,
    period: metric.period,
    tone: metric.percentageChange < 0 ? "negative" : "positive",
    isLoading,
  };
}

export function splitGrowthMarketingMetrics(
  metrics: GrowthMarketingMetricItem[],
  isLoading: boolean,
) {
  const metricsByKey = new Map(metrics.map((metric) => [metric.key, metric]));

  return {
    featuredMetrics: FEATURED_METRIC_DEFS.map((def) =>
      toGrowthMarketingMetric(def, metricsByKey, isLoading),
    ),
    summaryMetrics: SUMMARY_METRIC_DEFS.map((def) =>
      toGrowthMarketingMetric(def, metricsByKey, isLoading),
    ),
  };
}

export function toLocationShares(
  distribution: GrowthMarketingCountryDistribution[],
): GrowthMarketingLocationShare[] {
  return distribution.map((entry, index) => ({
    country: entry.country === "Unknown" ? entry.country : toTitleCase(entry.country),
    percent: entry.percentage,
    color: LOCATION_COLORS[index % LOCATION_COLORS.length],
  }));
}

export function toUserGrowthTrend(
  points: GrowthMarketingUserGrowthPoint[],
): GrowthMarketingTrendPoint[] {
  return points.map((point) => ({
    month: point.label,
    verified: point.verified,
    unverified: point.unverified,
  }));
}
