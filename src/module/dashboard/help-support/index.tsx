"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { HelpSupportMetrics } from "@/module/dashboard/help-support/components/help-support-metrics";
import { HELP_SUPPORT_TAB_COMPONENTS } from "@/module/dashboard/help-support/components/tab-table-components";
import {
  DEFAULT_HELP_SUPPORT_TAB,
  helpSupportMetrics,
  helpSupportTabs,
  type HelpSupportTabValue,
} from "@/module/dashboard/help-support/data";

type HelpSupportQuery = {
  tab?: string;
  page?: string;
};

function isHelpSupportTab(value: string | null | undefined): value is HelpSupportTabValue {
  return helpSupportTabs.some((tab) => tab.value === value);
}

export function HelpSupportDashboard() {
  const { value, setURLQuery } = useURLQuery<HelpSupportQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isHelpSupportTab(value.tab) ? value.tab : DEFAULT_HELP_SUPPORT_TAB;
  const ActiveTabContent = HELP_SUPPORT_TAB_COMPONENTS[activeTab].slots.content;

  const handleTabChange = (nextTab: string) => {
    if (!isHelpSupportTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      page: "1",
    });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Help & Support"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

      <HelpSupportMetrics metrics={helpSupportMetrics} />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="rounded-2xl bg-primary-white px-4">
            <div className="no-scrollbar w-full overflow-x-auto pb-1">
              <TabsList
                variant="line"
                className="inline-flex min-w-max justify-start gap-8 bg-transparent px-5"
              >
                {helpSupportTabs.map((tab) => (
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
