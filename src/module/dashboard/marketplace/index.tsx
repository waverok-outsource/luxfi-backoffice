"use client";

import { ChevronDown, Search } from "lucide-react";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { TableSearchField } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { MarketplaceMetrics } from "@/module/dashboard/marketplace/components/marketplace-metrics";
import { MARKETPLACE_TAB_COMPONENTS } from "@/module/dashboard/marketplace/components/tab-table-components";
import { DEFAULT_MARKETPLACE_TAB, marketplaceTabs, type MarketplaceTabValue } from "@/module/dashboard/marketplace/data";

type MarketplaceQuery = {
  tab?: string;
  page?: string;
  q?: string;
};

function isMarketplaceTab(value: string | null | undefined): value is MarketplaceTabValue {
  return marketplaceTabs.some((tab) => tab.value === value);
}

function MarketplaceContent() {
  const { value, setURLQuery } = useURLQuery<MarketplaceQuery>();
  const activeTab = isMarketplaceTab(value.tab) ? value.tab : DEFAULT_MARKETPLACE_TAB;
  const activeTabConfig = MARKETPLACE_TAB_COMPONENTS[activeTab];
  const ActiveTabAction = activeTabConfig.slots.action;
  const ActiveTabContent = activeTabConfig.slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isMarketplaceTab(nextTab)) {
      return;
    }

    setURLQuery({ tab: nextTab, page: undefined, q: undefined });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader title="MarketPlace" description="Real time analytics and overview at a glance" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input placeholder="Search" startAdornment={<Search className="h-5 w-5 text-text-grey" />} />
        </div>

        <AnalyticsToolbar />
      </div>

      <MarketplaceMetrics />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {marketplaceTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-sm leading-tight md:text-base">
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

export function MarketplaceDashboard() {
  return <MarketplaceContent />;
}
