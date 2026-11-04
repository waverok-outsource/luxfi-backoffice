"use client";

import { useRouter } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ConfigurationsTable } from "@/module/dashboard/kyc/components/configurations-table";
import { SubmissionsTable } from "@/module/dashboard/kyc/components/submissions-table";
import route from "@/util/route";

type KycDashboardQuery = {
  tab?: string;
  page?: string;
  q?: string;
  severity?: string;
  status?: string;
  tier?: string;
};

const TABS = [
  { value: "configuration", label: "Configuration" },
  { value: "submissions", label: "Submissions" },
] as const;

export function KycDashboard() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<KycDashboardQuery>();
  const activeTab = value.tab === "submissions" ? "submissions" : "configuration";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <DashboardPageHeader
          title="KYC"
          description="Configure verification tiers and review customer submissions"
        />
        {activeTab === "configuration" ? (
          <Button type="button" onClick={() => router.push(route.dashboard.kycConfigurationNew)}>
            Create configuration
          </Button>
        ) : null}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(next) =>
          setURLQuery({
            tab: next === "configuration" ? undefined : next,
            page: undefined,
            q: undefined,
            severity: undefined,
            status: undefined,
            tier: undefined,
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

      {activeTab === "configuration" ? <ConfigurationsTable /> : <SubmissionsTable />}
    </div>
  );
}
