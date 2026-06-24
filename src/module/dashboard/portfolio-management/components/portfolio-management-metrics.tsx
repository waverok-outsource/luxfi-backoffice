"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { usePortfolioAnalytics } from "@/services/queries/portfolio.queries";
import type { PortfolioAnalyticsMetricType } from "@/types/portfolio.type";
import { buildAnalyticsMetricCard } from "@/util/analytics-metrics";
import { formatCurrency } from "@/util/format-currency";

export function PortfolioManagementMetrics() {
  const { data } = usePortfolioAnalytics();

  const metrics = [
    buildAnalyticsMetricCard<PortfolioAnalyticsMetricType>(data?.assetCount, "Total Asset Count"),
    buildAnalyticsMetricCard(data?.assetValue, "Total Asset Value", (metric) =>
      formatCurrency(metric?.value, metric?.currencyCode),
    ),
    buildAnalyticsMetricCard(data?.assetCategories, "Total Asset Categories"),
    buildAnalyticsMetricCard(data?.publishedAsset, "Published Assets"),
    buildAnalyticsMetricCard(data?.unpublishedAsset, "Unpublished Assets"),
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
          valueClassName="whitespace-nowrap"
        />
      ))}
    </div>
  );
}
