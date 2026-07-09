"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useAssetItemsContext } from "@/module/dashboard/asset-management/asset-class-details/context";
import { formatCurrency } from "@/util/format-currency";

export function AssetClassMetrics() {
  const { items } = useAssetItemsContext();

  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);
  const categoryCount = new Set(items.map((item) => item.assetCategoryName)).size;
  const publishedCount = items.filter((item) => item.listingStatus === "listed").length;
  const unpublishedCount = items.length - publishedCount;

  const metrics = [
    { title: "Total Asset Count", value: String(items.length) },
    { title: "Total Asset Value", value: formatCurrency(totalValue, "USD") },
    { title: "Total Asset Categories", value: String(categoryCount) },
    { title: "Published Assets", value: String(publishedCount) },
    { title: "Unpublished Assets", value: String(unpublishedCount) },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          trend="67%"
          period="Last 7 days"
          tone="positive"
          valueClassName="whitespace-nowrap"
        />
      ))}
    </div>
  );
}
