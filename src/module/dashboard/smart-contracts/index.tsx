"use client";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SmartContractMetrics } from "@/module/dashboard/smart-contracts/components/smart-contract-metrics";
import { SmartContractsTable } from "@/module/dashboard/smart-contracts/components/tables/smart-contracts-table";
import {
  smartContractAutoLiquidationMetric,
  smartContractMarketAssets,
  smartContractMetrics,
} from "@/module/dashboard/smart-contracts/data";

export function SmartContractsDashboard() {
  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Smart Contracts"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar />

      <SmartContractMetrics
        metrics={smartContractMetrics}
        autoLiquidationMetric={smartContractAutoLiquidationMetric}
        marketAssets={smartContractMarketAssets}
      />

      <section className="space-y-3">
        <div className="rounded-2xl bg-primary-white px-5 pt-5">
          <h2 className="text-[22px] font-semibold text-text-black">Smart Contract</h2>
          <div className="mt-4 h-1 w-[164px] rounded-full bg-primary-black" />
        </div>

        <SmartContractsTable />
      </section>
    </div>
  );
}
