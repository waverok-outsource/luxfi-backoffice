"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { SYSTEM_SETTINGS_TAB_COMPONENTS } from "@/module/dashboard/system-settings/components/tab-content";
import { TeamManagementMetrics } from "@/module/dashboard/system-settings/components/team-management-metrics";
import {
  DEFAULT_SYSTEM_SETTINGS_TAB,
  systemSettingsTabs,
  type SystemSettingsTabValue,
} from "@/module/dashboard/system-settings/data";

type SystemSettingsQuery = {
  tab?: string;
  page?: string;
  search?: string;
};

function isSystemSettingsTab(value: string | null | undefined): value is SystemSettingsTabValue {
  return systemSettingsTabs.some((tab) => tab.value === value);
}

export function SystemSettingsDashboard() {
  const { value, setURLQuery } = useURLQuery<SystemSettingsQuery>();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isSystemSettingsTab(value.tab) ? value.tab : DEFAULT_SYSTEM_SETTINGS_TAB;
  const ActiveTabContent = SYSTEM_SETTINGS_TAB_COMPONENTS[activeTab].content;

  const handleTabChange = (nextTab: string) => {
    if (!isSystemSettingsTab(nextTab)) {
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
        title="System Settings"
        description="Real time analytics and overview at a glance"
      />

      <AnalyticsToolbar range={range} onRangeChange={setRange} />

      <TeamManagementMetrics />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="rounded-2xl bg-primary-white px-4">
            <div className="no-scrollbar w-full overflow-x-auto pb-1">
              <TabsList
                variant="line"
                className="inline-flex min-w-max justify-start gap-8 bg-transparent px-5"
              >
                {systemSettingsTabs.map((tab) => (
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
