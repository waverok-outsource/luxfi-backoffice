"use client";

import { useRouter } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AccessRulesTable } from "@/module/dashboard/kyc/components/access-rules-table";
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
  resource?: string;
};

const TABS = [
  { value: "configuration", label: "Configuration" },
  { value: "submissions", label: "Submissions" },
  { value: "resource-access", label: "Resource access" },
] as const;

type KycTab = (typeof TABS)[number]["value"];

function resolveTab(tab?: string): KycTab {
  if (tab === "submissions" || tab === "resource-access") return tab;
  return "configuration";
}

export function KycDashboard() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<KycDashboardQuery>();
  const activeTab = resolveTab(value.tab);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <DashboardPageHeader
          title="KYC"
          description={
            activeTab === "resource-access"
              ? "Set the minimum KYC tier a customer must hold before they can use a resource"
              : "Configure verification tiers and review customer submissions"
          }
        />
        {activeTab === "configuration" ? (
          <Button type="button" onClick={() => router.push(route.dashboard.kycConfigurationNew)}>
            Create configuration
          </Button>
        ) : null}
        {activeTab === "resource-access" ? (
          <Button type="button" onClick={() => router.push(route.dashboard.kycResourceAccessNew)}>
            Create rule
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
            resource: undefined,
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

      {activeTab === "configuration" ? <ConfigurationsTable /> : null}
      {activeTab === "submissions" ? <SubmissionsTable /> : null}
      {activeTab === "resource-access" ? <AccessRulesTable /> : null}
    </div>
  );
}
