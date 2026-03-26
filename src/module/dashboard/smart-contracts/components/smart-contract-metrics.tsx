"use client";

import { Coins, FileCheck2, LockKeyhole } from "lucide-react";

import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  SmartContractAutoLiquidationMetric,
  SmartContractMarketAsset,
  SmartContractMetric,
} from "@/module/dashboard/smart-contracts/data";

function MetricTrend({ trend, period }: { trend: string; period: string }) {
  return (
    <Badge variant="active" className="mt-auto gap-1.5 px-2 py-1">
      <span>{trend} ▲</span>
      <span>{period}</span>
    </Badge>
  );
}

function AutoLiquidationCard({ metric }: { metric: SmartContractAutoLiquidationMetric }) {
  return (
    <article className="flex min-h-[172px] flex-col rounded-2xl bg-primary-white p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-text-grey">
        <Coins className="h-4 w-4" />
        <span>{metric.title}</span>
      </p>
      <ScoreGauge percent={metric.value} className="mt-2" svgClassName="h-[80px] w-[152px]" />
      <MetricTrend trend={metric.trend} period={metric.period} />
    </article>
  );
}

function TokenMark({ symbol }: { symbol: SmartContractMarketAsset["symbol"] }) {
  const styles: Record<SmartContractMarketAsset["symbol"], string> = {
    BTC: "bg-[#FFF1E6] text-[#F7931A]",
    ETH: "bg-[#EEF1FF] text-[#627EEA]",
    ALG: "bg-[#FFF0F5] text-[#F06292]",
  };

  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-2xl text-base font-bold",
        styles[symbol],
      )}
    >
      {symbol === "BTC" ? "₿" : symbol[0]}
    </span>
  );
}

function MarketAssetRow({ asset }: { asset: SmartContractMarketAsset }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <TokenMark symbol={asset.symbol} />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#485179] md:text-[15px]">
            {asset.name}
          </p>
          <p className="text-sm text-[#68738F] md:text-[13px]">{asset.symbol}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "text-xl font-semibold md:text-[16px]",
            asset.tone === "negative" ? "text-alert-error" : "text-alert-success",
          )}
        >
          {asset.price}
        </p>
        <Badge
          variant={asset.tone === "negative" ? "error" : "active"}
          className="mt-2 h-5 gap-1 px-2 text-[11px]"
        >
          <span>{asset.change}</span>
          <span>{asset.tone === "negative" ? "▼" : "▲"}</span>
        </Badge>
      </div>
    </div>
  );
}

function MarketOverviewCard({ assets }: { assets: SmartContractMarketAsset[] }) {
  return (
    <article className="rounded-2xl bg-primary-white p-5">
      <div className="space-y-4">
        {assets.map((asset) => (
          <MarketAssetRow key={asset.symbol} asset={asset} />
        ))}
      </div>
    </article>
  );
}

export function SmartContractMetrics({
  metrics,
  autoLiquidationMetric,
  marketAssets,
}: {
  metrics: SmartContractMetric[];
  autoLiquidationMetric: SmartContractAutoLiquidationMetric;
  marketAssets: SmartContractMarketAsset[];
}) {
  const [activeContractsMetric, lockedCollateralMetric] = metrics;

  if (!activeContractsMetric || !lockedCollateralMetric) {
    return null;
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(280px,1.3fr)]">
      <StatCard
        {...activeContractsMetric}
        tone="positive"
        icon={<FileCheck2 className="h-4 w-4" />}
        className="flex min-h-[172px] flex-col"
        valueClassName="mt-9 whitespace-nowrap text-[22px] md:text-[30px]"
        trendClassName="mt-auto self-start"
      />
      <StatCard
        {...lockedCollateralMetric}
        tone="positive"
        icon={<LockKeyhole className="h-4 w-4" />}
        className="flex min-h-[172px] flex-col"
        valueClassName="mt-9 whitespace-nowrap text-[22px] md:text-[30px]"
        trendClassName="mt-auto self-start"
      />
      <AutoLiquidationCard metric={autoLiquidationMetric} />
      <MarketOverviewCard assets={marketAssets} />
    </div>
  );
}
