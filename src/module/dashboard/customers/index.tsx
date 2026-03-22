"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { ChevronDown, Download, Search } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { StatCard } from "@/module/dashboard/home/components/stat-card";
import { CustomerChannelCard } from "@/module/dashboard/customers/components/customer-channel-card";
import { CUSTOMERS_TAB_COMPONENTS } from "@/module/dashboard/customers/components/tab-table-components";
import {
  customerChannels,
  customerStats,
  customersTabs,
  DEFAULT_CUSTOMERS_TAB,
  type CustomersTabValue,
} from "@/module/dashboard/customers/data";

type CustomersQuery = {
  tab?: string;
  page?: string;
};

function isCustomersTab(value: string | null | undefined): value is CustomersTabValue {
  return customersTabs.some((tab) => tab.value === value);
}

export function CustomersDashboard() {
  const { value, setURLQuery } = useURLQuery<CustomersQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isCustomersTab(value.tab) ? value.tab : DEFAULT_CUSTOMERS_TAB;
  const ActiveTabContent = CUSTOMERS_TAB_COMPONENTS[activeTab].slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isCustomersTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      page: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Customers"
        description="Real time analytics and overview at a glance"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search ..."
            startAdornment={<Search className="h-5 w-5 text-text-grey" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            mode="range"
            range={range}
            onRangeChange={setRange}
            className="h-12 rounded-xl border border-primary-grey-stroke bg-primary-white text-text-grey"
            numberOfMonths={2}
          />
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
        {customerStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            period={stat.period}
            tone={stat.tone}
          />
        ))}
        <CustomerChannelCard channels={customerChannels} />
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
            <Input
              placeholder="Search Customer name or ID"
              startAdornment={<Search className="h-5 w-5 text-text-grey" />}
            />
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
