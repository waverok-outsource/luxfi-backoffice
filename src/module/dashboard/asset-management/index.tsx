"use client";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { TableSearchField } from "@/components/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ASSET_MANAGEMENT_TAB_COMPONENTS } from "@/module/dashboard/asset-management/components/tab-table-components";
import {
  ASSET_TYPE_FILTER_OPTIONS,
  DEFAULT_ASSET_MANAGEMENT_TAB,
  type AssetManagementTabValue,
  assetManagementTabs,
} from "@/module/dashboard/asset-management/data";

type AssetManagementQuery = {
  tab?: string;
  page?: string;
  q?: string;
  type?: string;
};

function isAssetManagementTab(value: string | null | undefined): value is AssetManagementTabValue {
  return assetManagementTabs.some((tab) => tab.value === value);
}

export function AssetManagementDashboard() {
  const { value, setURLQuery } = useURLQuery<AssetManagementQuery>();

  const activeTab = isAssetManagementTab(value.tab) ? value.tab : DEFAULT_ASSET_MANAGEMENT_TAB;
  const activeTabConfig = ASSET_MANAGEMENT_TAB_COMPONENTS[activeTab];
  const ActiveTabAction = activeTabConfig.slots.action;
  const ActiveTabContent = activeTabConfig.slots.content;
  const activeTypeFilter = value.type ?? "all";

  const handleTabChange = (nextTab: string) => {
    if (!isAssetManagementTab(nextTab)) {
      return;
    }

    setURLQuery({ tab: nextTab, page: undefined, q: undefined, type: undefined });
  };

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Asset Management"
        description="Real time management of Assets and Integrations"
      />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {assetManagementTabs.map((tab) => (
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
            <TableSearchField placeholder="Search Asset name or ID" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={activeTypeFilter}
              onValueChange={(nextType) =>
                setURLQuery({ type: nextType && nextType !== "all" ? nextType : undefined })
              }
            >
              <SelectTrigger className="w-[150px]" size="sm">
                <SelectValue>
                  {(selected: string | null) =>
                    ASSET_TYPE_FILTER_OPTIONS.find((option) => option.value === selected)?.label ??
                    "All"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {ActiveTabAction ? <ActiveTabAction /> : null}
          </div>
        </div>

        <ActiveTabContent />
      </div>
    </div>
  );
}
