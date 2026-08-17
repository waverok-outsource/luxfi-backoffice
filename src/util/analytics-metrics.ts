import type { MetricValue } from "@/types/analytics.type";

type AnalyticsGrowthPattern = "upward" | "downward";

type AnalyticsMetricType = {
  value: number;
  growth: string;
  growthDuration: string;
  growthPattern: AnalyticsGrowthPattern;
};

export type AnalyticsStatCardType = {
  title: string;
  value: string;
  trend: string;
  period: string;
  tone: "positive" | "negative";
  isLoading?: boolean;
};

export function formatAnalyticsNumber(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "--";
}

export function getAnalyticsMetricTone(pattern: AnalyticsGrowthPattern | undefined) {
  return pattern === "downward" ? "negative" : "positive";
}

export function buildAnalyticsMetricCard<T extends AnalyticsMetricType>(
  metric: T | undefined,
  title: string,
  valueFormatter: (metric: T | undefined) => string = (value) => formatAnalyticsNumber(value?.value),
  isLoading = false,
): AnalyticsStatCardType {
  return {
    title,
    value: valueFormatter(metric),
    trend: metric?.growth ?? "--",
    period: metric?.growthDuration ?? "--",
    tone: getAnalyticsMetricTone(metric?.growthPattern),
    isLoading,
  };
}

function metricValueTone(
  direction: MetricValue["trend"]["direction"] | undefined,
  isGoodWhenUp: boolean,
): "positive" | "negative" {
  if (direction === "flat" || direction === undefined) {
    return "positive";
  }

  return direction === "up" === isGoodWhenUp ? "positive" : "negative";
}

// Builder for the MetricValue wire shape ({ value, displayValue, trend }) used by
// the /v1/analytics/* endpoints. The value is rendered from displayValue, which the
// backend already formats (currency, digits, etc.).
export function buildMetricValueCard(
  metric: MetricValue | undefined,
  title: string,
  isLoading = false,
  isGoodWhenUp = true,
): AnalyticsStatCardType {
  return {
    title,
    value: metric?.displayValue ?? "--",
    trend: metric?.trend.displayValue ?? "--",
    period: metric?.trend.period ?? "--",
    tone: metricValueTone(metric?.trend.direction, isGoodWhenUp),
    isLoading,
  };
}
