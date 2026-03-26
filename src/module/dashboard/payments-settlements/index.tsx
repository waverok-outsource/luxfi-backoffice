"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { PAYMENTS_TAB_COMPONENTS } from "@/module/dashboard/payments-settlements/components/tab-table-components";
import { PaymentsSettlementsMetrics } from "@/module/dashboard/payments-settlements/components/payments-settlements-metrics";
import {
  assetTradeSummary,
  DEFAULT_PAYMENTS_HISTORY_TAB,
  leadingMetrics,
  paymentsHistoryTabs,
  trailingMetrics,
  type PaymentsHistoryTabValue,
} from "@/module/dashboard/payments-settlements/data";

type PaymentsSettlementsQuery = {
  tab?: string;
  page?: string;
  search?: string;
};

function isPaymentsHistoryTab(
  value: string | null | undefined,
): value is PaymentsHistoryTabValue {
  return paymentsHistoryTabs.some((tab) => tab.value === value);
}

export function PaymentsSettlementsDashboard() {
  const { value, setURLQuery } = useURLQuery<PaymentsSettlementsQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isPaymentsHistoryTab(value.tab)
    ? value.tab
    : DEFAULT_PAYMENTS_HISTORY_TAB;
  const ActiveTabContent = PAYMENTS_TAB_COMPONENTS[activeTab].slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isPaymentsHistoryTab(nextTab)) {
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
        title="Payments & Settlements"
        description="Manage and track all transactions inflow and outflow"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

      <PaymentsSettlementsMetrics
        leadingMetrics={leadingMetrics}
        trailingMetrics={trailingMetrics}
        assetTradeSummary={assetTradeSummary}
      />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="rounded-2xl bg-primary-white px-4">
            <div className="no-scrollbar w-full overflow-x-auto pb-1">
              <TabsList
                variant="line"
                className="inline-flex min-w-max justify-start gap-8 bg-transparent px-5"
              >
                {paymentsHistoryTabs.map((tab) => (
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
