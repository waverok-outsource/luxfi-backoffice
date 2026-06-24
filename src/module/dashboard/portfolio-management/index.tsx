"use client";

import { ChevronDown, Download, RotateCcw } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { TableSearchField } from "@/components/table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLDateRange } from "@/hooks/useURLDateRange";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { PortfolioManagementMetrics } from "@/module/dashboard/portfolio-management/components/portfolio-management-metrics";
import { PORTFOLIO_TAB_COMPONENTS } from "@/module/dashboard/portfolio-management/components/tab-table-components";
import {
  DEFAULT_PORTFOLIO_TAB,
  type PortfolioTabValue,
  portfolioTabs,
} from "@/module/dashboard/portfolio-management/data";

type PortfolioQuery = {
  tab?: string;
  page?: string;
  q?: string;
  from?: string;
  to?: string;
};

function isPortfolioTab(value: string | null | undefined): value is PortfolioTabValue {
  return portfolioTabs.some((tab) => tab.value === value);
}

export function PortfolioManagementDashboard() {
  const { value, setURLQuery } = useURLQuery<PortfolioQuery>();
  const { range, setRange, resetRange, hasRange } = useURLDateRange();

  const activeTab = isPortfolioTab(value.tab) ? value.tab : DEFAULT_PORTFOLIO_TAB;
  const activeTabConfig = PORTFOLIO_TAB_COMPONENTS[activeTab];
  const ActiveTabFilters = activeTabConfig.slots.filters;
  const ActiveTabAction = activeTabConfig.slots.action;
  const ActiveTabContent = activeTabConfig.slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isPortfolioTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      page: undefined,
      q: undefined,
      from: undefined,
      to: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Portfolio Management"
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

      <PortfolioManagementMetrics />

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
            <TableSearchField placeholder="Search name or ID" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ActiveTabFilters ? <ActiveTabFilters /> : null}
            <Button
              variant="ghost"
              className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
            >
              Filter Options
              <ChevronDown className="h-4 w-4 text-text-grey" />
            </Button>

            {ActiveTabAction ? <ActiveTabAction /> : null}
          </div>
        </div>

        <ActiveTabContent />
      </div>
    </div>
  );
}
