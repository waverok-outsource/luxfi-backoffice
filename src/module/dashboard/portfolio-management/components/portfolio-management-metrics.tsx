"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { usePortfolioAnalytics } from "@/services/queries/portfolio.queries";
import type { PortfolioAnalyticsMetricType } from "@/types/portfolio.type";
import { buildAnalyticsMetricCard } from "@/util/analytics-metrics";
import { formatCurrency } from "@/util/format-currency";

export function PortfolioManagementMetrics() {
  const { data, isLoading } = usePortfolioAnalytics();

  const metrics = [
    buildAnalyticsMetricCard<PortfolioAnalyticsMetricType>(
      data?.assetCount,
      "Total Asset Count",
      undefined,
      isLoading,
    ),
    buildAnalyticsMetricCard(
      data?.assetValue,
      "Total Asset Value",
      (metric) => formatCurrency(metric?.value, metric?.currencyCode),
      isLoading,
    ),
    buildAnalyticsMetricCard(data?.assetCategories, "Total Asset Categories", undefined, isLoading),
    buildAnalyticsMetricCard(data?.publishedAsset, "Published Assets", undefined, isLoading),
    buildAnalyticsMetricCard(data?.unpublishedAsset, "Unpublished Assets", undefined, isLoading),
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          trend={metric.trend}
          period={metric.period}
          tone={metric.tone}
          isLoading={metric.isLoading}
          valueClassName="whitespace-nowrap"
        />
      ))}
    </div>
  );
}
