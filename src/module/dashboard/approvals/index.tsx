"use client";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ApprovalsTable } from "@/module/dashboard/approvals/components/tables/approvals-table";
import type { ApprovalListScope } from "@/types/approval.type";

type ApprovalsQuery = {
  tab?: string;
  page?: string;
  q?: string;
};

const TABS: { value: ApprovalListScope; label: string }[] = [
  { value: "queue", label: "All approvals" },
  { value: "mine", label: "My requests" },
];

export function ApprovalsDashboard() {
  const { value, setURLQuery } = useURLQuery<ApprovalsQuery>();
  const activeTab: ApprovalListScope = value.tab === "mine" ? "mine" : "queue";

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Approvals"
        description="Review requests, approve or reject them, and cancel ones you created"
      />

      <Tabs
        value={activeTab}
        onValueChange={(next) =>
          setURLQuery({
            tab: next === "queue" ? undefined : next,
            page: undefined,
            q: undefined,
          })
        }
      >
        <div className="no-scrollbar w-full overflow-x-auto">
          <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <ApprovalsTable scope={activeTab} />
    </div>
  );
}
