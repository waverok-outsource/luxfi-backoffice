"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetLoanMetrics } from "@/module/dashboard/asset-loans/components/asset-loan-metrics";
import { ASSET_LOANS_TAB_COMPONENTS } from "@/module/dashboard/asset-loans/components/tab-table-components";
import {
  assetLoansMetrics,
  assetLoansTabs,
  DEFAULT_ASSET_LOANS_TAB,
  type AssetLoanTabValue,
} from "@/module/dashboard/asset-loans/data";

type AssetLoansQuery = {
  tab?: string;
  page?: string;
  search?: string;
};

function isAssetLoanTab(value: string | null | undefined): value is AssetLoanTabValue {
  return assetLoansTabs.some((tab) => tab.value === value);
}

export function AssetLoansDashboard() {
  const { value, setURLQuery } = useURLQuery<AssetLoansQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isAssetLoanTab(value.tab) ? value.tab : DEFAULT_ASSET_LOANS_TAB;
  const ActiveTabContent = ASSET_LOANS_TAB_COMPONENTS[activeTab].slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isAssetLoanTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      page: "1",
      search: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Asset Loan Operations"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

      <AssetLoanMetrics metrics={assetLoansMetrics} />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="rounded-2xl bg-primary-white px-4">
            <div className="no-scrollbar w-full overflow-x-auto pb-1">
              <TabsList
                variant="line"
                className="inline-flex min-w-max justify-start gap-8 bg-transparent px-5"
              >
                {assetLoansTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="shrink-0 whitespace-nowrap text-sm leading-tight md:text-base"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </Tabs>

        <ActiveTabContent />
      </div>
    </div>
  );
}
