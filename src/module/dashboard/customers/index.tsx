"use client";

import { ChevronDown, Download, RotateCcw } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { TableSearchField } from "@/components/table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLDateRange } from "@/hooks/useURLDateRange";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { CustomerChannelCard } from "@/module/dashboard/customers/components/customer-channel-card";
import { CUSTOMERS_TAB_COMPONENTS } from "@/module/dashboard/customers/components/tab-table-components";
import {
  customersTabs,
  DEFAULT_CUSTOMERS_TAB,
  type CustomersTabValue,
} from "@/module/dashboard/customers/data";
import { useCustomerAnalytics } from "@/services/queries/customer.queries";
import { buildMetricValueCard } from "@/util/analytics-metrics";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type CustomersQuery = {
  tab?: string;
  page?: string;
  from?: string;
  to?: string;
};

function isCustomersTab(value: string | null | undefined): value is CustomersTabValue {
  return customersTabs.some((tab) => tab.value === value);
}

export function CustomersDashboard() {
  const { value, setURLQuery } = useURLQuery<CustomersQuery>();
  const { range, setRange, resetRange, hasRange } = useURLDateRange();

  const activeTab = isCustomersTab(value.tab) ? value.tab : DEFAULT_CUSTOMERS_TAB;
  const ActiveTabContent = CUSTOMERS_TAB_COMPONENTS[activeTab].slots.content;

  const analyticsQuery = convertObjectToQuery({
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: analyticsResponse, isLoading: statsLoading } = useCustomerAnalytics(analyticsQuery);
  const analytics = analyticsResponse?.data;
  const totalRegistered = buildMetricValueCard(
    analytics?.metrics.totalRegistered,
    "Total Registered Customers",
    statsLoading,
  );
  const averageGrowth = buildMetricValueCard(
    analytics?.metrics.averageGrowth,
    "Average Customer Growth",
    statsLoading,
  );
  const channelItems = analytics?.connectivity.items ?? [];
  const channels = channelItems.map((item) => ({
    label: item.label,
    count: item.value,
    percent: item.percentage,
    tone: item.key === "online" ? ("success" as const) : ("error" as const),
  }));

  const handleTabChange = (nextTab: string) => {
    if (!isCustomersTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      page: undefined,
      from: undefined,
      to: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Customers"
        description="Real time analytics and overview at a glance"
      />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            mode="range"
            range={range}
            onRangeChange={setRange}
            className="h-12 rounded-xl border border-primary-grey-stroke bg-primary-white text-text-grey"
            numberOfMonths={2}
          />
          {hasRange ? (
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-12 rounded-xl border border-primary-grey-stroke bg-primary-white p-0 text-text-grey hover:bg-primary-grey-undertone"
              onClick={resetRange}
              aria-label="Reset date range"
            >
              <RotateCcw className="h-4 w-4 text-primary-black" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            className="h-12 rounded-xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
          >
            <Download className="h-4 w-4 text-primary-black" />
            Export
            <ChevronDown className="h-4 w-4 text-text-grey" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <StatCard {...totalRegistered} />
        <StatCard {...averageGrowth} />
        <CustomerChannelCard channels={channels} />
      </div>

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {customersTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-sm leading-tight md:text-base"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <TableSearchField placeholder="Search Customer name or ID" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
            >
              Filter Options
              <ChevronDown className="h-4 w-4 text-text-grey" />
            </Button>
          </div>
        </div>

        <ActiveTabContent />
      </div>
    </div>
  );
}
