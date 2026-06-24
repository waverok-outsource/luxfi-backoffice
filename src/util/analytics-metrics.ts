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
): AnalyticsStatCardType {
  return {
    title,
    value: valueFormatter(metric),
    trend: metric?.growth ?? "--",
    period: metric?.growthDuration ?? "--",
    tone: getAnalyticsMetricTone(metric?.growthPattern),
  };
}
