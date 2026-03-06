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
import { AddAssetModal } from "@/module/dashboard/portfolio-management/components/modals";
import { PORTFOLIO_TAB_COMPONENTS } from "@/module/dashboard/portfolio-management/components/tab-table-components";
import {
  DEFAULT_PORTFOLIO_TAB,
  type PortfolioTabValue,
  portfolioStats,
  portfolioTabs,
} from "@/module/dashboard/portfolio-management/data";
import { StatCard } from "@/module/dashboard/home/components/stat-card";

type PortfolioQuery = {
  tab?: string;
  page?: string;
};

function isPortfolioTab(value: string | null | undefined): value is PortfolioTabValue {
  return portfolioTabs.some((tab) => tab.value === value);
}

export function PortfolioManagementDashboard() {
  const { value, setURLQuery } = useURLQuery<PortfolioQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isPortfolioTab(value.tab) ? value.tab : DEFAULT_PORTFOLIO_TAB;
  const activeTabConfig = portfolioTabs.find((tab) => tab.value === activeTab) ?? portfolioTabs[0];
  const ActiveTabTable = PORTFOLIO_TAB_COMPONENTS[activeTab];
  const actionButton =
    activeTabConfig.actionLabel && activeTab === "portfolio-inventory" ? (
      <AddAssetModal triggerLabel={activeTabConfig.actionLabel} />
    ) : activeTabConfig.actionLabel ? (
      <Button variant="default" className="h-12 rounded-2xl px-5">
        {activeTabConfig.actionLabel}
      </Button>
    ) : null;

  const handleTabChange = (nextTab: string) => {
    if (!isPortfolioTab(nextTab)) {
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
        title="Portfolio Management"
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {portfolioStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            period={stat.period}
            tone="positive"
          />
        ))}
      </div>

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {portfolioTabs.map((tab) => (
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
              placeholder="Search name or ID"
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

            {actionButton}
          </div>
        </div>

        <ActiveTabTable />
      </div>
    </div>
  );
}
