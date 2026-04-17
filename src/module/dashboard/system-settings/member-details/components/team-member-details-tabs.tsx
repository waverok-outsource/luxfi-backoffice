"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { DeviceSessionLogsPanel } from "@/module/dashboard/system-settings/member-details/components/device-session-logs-panel";
import { UserActivityLogPanel } from "@/module/dashboard/system-settings/member-details/components/user-activity-log-panel";

const DEFAULT_TAB = "device-session-logs";

const tabs = [
  { value: "device-session-logs", label: "Device Session Logs" },
  { value: "user-activity-log", label: "User Activity Log" },
] as const;

type TeamMemberDetailsTabValue = (typeof tabs)[number]["value"];

function isTeamMemberDetailsTab(value: string | undefined): value is TeamMemberDetailsTabValue {
  return tabs.some((tab) => tab.value === value);
}

export function TeamMemberDetailsTabs({ memberId }: { memberId: string }) {
  const { value, setURLQuery } = useURLQuery<{ tab?: string; page?: string; search?: string }>();
  const activeTab = isTeamMemberDetailsTab(value.tab) ? value.tab : DEFAULT_TAB;

  const panels: Record<TeamMemberDetailsTabValue, React.ReactNode> = {
    "device-session-logs": <DeviceSessionLogsPanel memberId={memberId} />,
    "user-activity-log": <UserActivityLogPanel memberId={memberId} />,
  };

  return (
    <div className="space-y-3">
      <Tabs
        value={activeTab}
        onValueChange={(nextTab) => {
          if (!isTeamMemberDetailsTab(nextTab)) return;

          setURLQuery({
            tab: nextTab,
            page: undefined,
            search: undefined,
          });
        }}
        className="w-full"
      >
        <div className="rounded-2xl bg-primary-white px-4">
          <div className="no-scrollbar w-full overflow-x-auto pb-1">
            <TabsList
              variant="line"
              className="inline-flex min-w-max justify-start gap-8 bg-transparent px-5"
            >
              {tabs.map((tab) => (
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

      <div className="rounded-3xl bg-primary-white p-4 md:p-6">{panels[activeTab]}</div>
    </div>
  );
}
