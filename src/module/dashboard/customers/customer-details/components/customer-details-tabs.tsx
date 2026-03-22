"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { SmartContractsPanel } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contracts-panel";
import { AssetLoansPanel } from "@/module/dashboard/customers/customer-details/components/loans/asset-loans-panel";
import { KycCompliancePanel } from "@/module/dashboard/customers/customer-details/components/kyc/kyc-compliance-panel";
import { AssetPortfolioPanel } from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-panel";
import { DeviceSessionLogsPanel } from "@/module/dashboard/customers/customer-details/components/sessions/device-session-logs-panel";
import { SupportTicketsPanel } from "@/module/dashboard/customers/customer-details/components/support/support-tickets-panel";
import { TransactionHistoryPanel } from "@/module/dashboard/customers/customer-details/components/transactions/transaction-history-panel";

const DEFAULT_TAB = "kyc";

const tabs = [
  { value: "kyc", label: "KYC & Compliance" },
  { value: "transactions", label: "Transactions History" },
  { value: "loans", label: "Asset Loans" },
  { value: "contracts", label: "Smart Contracts" },
  { value: "portfolio", label: "Asset Portfolio" },
  { value: "device", label: "Device Session Logs" },
  { value: "support", label: "Support Tickets" },
] as const;

type CustomerDetailsTabValue = (typeof tabs)[number]["value"];

function isCustomerDetailsTab(value: string): value is CustomerDetailsTabValue {
  return tabs.some((tab) => tab.value === value);
}

const TAB_PANELS: Record<CustomerDetailsTabValue, React.ReactNode> = {
  kyc: <KycCompliancePanel />,
  transactions: <TransactionHistoryPanel />,
  loans: <AssetLoansPanel />,
  contracts: <SmartContractsPanel />,
  portfolio: <AssetPortfolioPanel />,
  device: <DeviceSessionLogsPanel />,
  support: <SupportTicketsPanel />,
};

export function CustomerDetailsTabs() {
  const { value, setURLQuery } = useURLQuery<{ tab?: string; page?: string }>();

  const tabQuery = value.tab;
  const activeTab: CustomerDetailsTabValue =
    typeof tabQuery === "string" && isCustomerDetailsTab(tabQuery) ? tabQuery : DEFAULT_TAB;

  const handleTabChange = (nextTab: string) => {
    if (!isCustomerDetailsTab(nextTab)) return;

    setURLQuery({
      tab: nextTab,
      // Reset table pagination when switching tabs.
      page: undefined,
    });
  };

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="no-scrollbar w-full overflow-x-auto">
          <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm md:text-base">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="rounded-3xl bg-primary-white p-4 md:p-6">
        {TAB_PANELS[activeTab]}
      </div>
    </div>
  );
}
