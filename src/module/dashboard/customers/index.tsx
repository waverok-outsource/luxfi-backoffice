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
import { useCustomers } from "@/services/queries/customer.queries";

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

  const { data: customersResponse, isLoading: statsLoading } = useCustomers("");
  const stats = customersResponse?.data.stats;

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
        <StatCard
          title="Total Registered Customers"
          value={stats ? stats.customerCount.value.toLocaleString() : "--"}
          trend={stats ? `${stats.customerCount.growth}%` : "--"}
          period={stats ? `Last ${stats.customerCount.growthDuration}` : undefined}
          tone={stats?.customerCount.growthPattern === "downward" ? "negative" : "positive"}
          isLoading={statsLoading}
        />
        <StatCard
          title="Average Customer Growth"
          value={stats ? String(stats.customerGrowth.value) : "--"}
          trend={stats ? `${stats.customerGrowth.growth}%` : "--"}
          period={stats ? `Last ${stats.customerGrowth.growthDuration}` : undefined}
          tone={stats?.customerGrowth.growthPattern === "downward" ? "negative" : "positive"}
          isLoading={statsLoading}
        />
        <CustomerChannelCard
          channels={[
            {
              label: "Online Customers",
              count: stats?.connectivity.online.count ?? 0,
              percent: stats?.connectivity.online.percent ?? 0,
              tone: "success",
            },
            {
              label: "Offline Customers",
              count: stats?.connectivity.offline.count ?? 0,
              percent: stats?.connectivity.offline.percent ?? 0,
              tone: "error",
            },
          ]}
        />
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
