"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { ChevronDown, Search } from "lucide-react";

import { AnalyticsToolbar } from "@/components/dashboard/analytics-toolbar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { TeamManagementMetrics } from "@/module/dashboard/system-settings/components/team-management-metrics";
import { RolesPermissionsTable } from "@/module/dashboard/system-settings/components/tables/roles-permissions-table";
import { TeamManagementTable } from "@/module/dashboard/system-settings/components/tables/team-management-table";
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
  const { search, setSearch } = useURLTableSearch();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  const activeTab = isSystemSettingsTab(value.tab) ? value.tab : DEFAULT_SYSTEM_SETTINGS_TAB;
  const isTeamManagementTab = activeTab === "team-management";

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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <Input
              placeholder={
                isTeamManagementTab ? "Search user name or ID" : "Search role name or permission"
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              startAdornment={<Search className="h-5 w-5 text-text-grey" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
            >
              Filter Options
              <ChevronDown className="h-4 w-4 text-text-grey" />
            </Button>

            <Button type="button" className="h-12 rounded-2xl px-5">
              {isTeamManagementTab ? "Add New Member" : "Add New Role"}
            </Button>
          </div>
        </div>

        {isTeamManagementTab ? <TeamManagementTable /> : <RolesPermissionsTable />}
      </div>
    </div>
  );
}
