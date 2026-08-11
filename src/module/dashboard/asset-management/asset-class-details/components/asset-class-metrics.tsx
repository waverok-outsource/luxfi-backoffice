"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useAssets } from "@/services/queries/asset-management.queries";
import type { AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";

type AssetClassMetricsProps = {
  assetClass: AssetClassType;
};

export function AssetClassMetrics({ assetClass }: AssetClassMetricsProps) {
  const { data: assetsResponse } = useAssets(
    convertObjectToQuery({ assetClassId: assetClass.classId }),
  );
  const items = assetsResponse?.data ?? [];

  const totalValue = items.reduce((sum, item) => sum + item.price.value, 0);
  const categoryCount = new Set(items.map((item) => item.assetCategoryName)).size;
  const publishedCount = items.filter((item) => item.onSale).length;
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
