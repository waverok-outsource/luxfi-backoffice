"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { TableSearchField } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { USER_PORTFOLIO_DETAILS_TAB_COMPONENTS } from "@/module/dashboard/asset-management/user-portfolios/components/tab-table-components";
import { PortfolioValueDonut } from "@/module/dashboard/asset-management/user-portfolios/components/portfolio-value-donut";
import {
  DEFAULT_USER_PORTFOLIO_DETAILS_TAB,
  userPortfolioDetailsTabs,
  type UserPortfolioDetailsTabValue,
} from "@/module/dashboard/asset-management/user-portfolios/data";
import { useCustomerPortfolioAggregate } from "@/services/queries/customer-asset.queries";
import type { CustomerPortfolioAggregateType } from "@/types/asset-management.type";
import { formatCurrency } from "@/util/format-currency";
import route from "@/util/route";

const ASSET_TYPE_LABELS: Record<CustomerPortfolioAggregateType["assetType"], string> = {
  tangible: "Tangible Assets",
  digital: "Digital Assets",
};

function isUserPortfolioDetailsTab(value: string | null | undefined): value is UserPortfolioDetailsTabValue {
  return userPortfolioDetailsTabs.some((tab) => tab.value === value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function BackToAssetManagement({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
      <p className="font-semibold text-text-black">User asset portfolio not found</p>
      <button
        type="button"
        className="text-sm text-primary-gold-brand underline"
        onClick={onBack}
      >
        Back to Asset Management
      </button>
    </div>
  );
}

function UserPortfolioDetailsContent({
  aggregate,
  customerId,
  assetType,
  portfolioId,
}: {
  aggregate: CustomerPortfolioAggregateType;
  customerId: string;
  assetType: string;
  portfolioId: string;
}) {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<{ tab?: string; q?: string }>();

  const activeTab = isUserPortfolioDetailsTab(value.tab) ? value.tab : DEFAULT_USER_PORTFOLIO_DETAILS_TAB;
  const activeTabConfig = USER_PORTFOLIO_DETAILS_TAB_COMPONENTS[activeTab];

  const handleTabChange = (nextTab: string) => {
    if (!isUserPortfolioDetailsTab(nextTab)) return;
    setURLQuery({ tab: nextTab, q: undefined });
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="User Asset Portfolio"
        entityId={portfolioId}
        idPrefix=""
        onBack={() => router.push(`${route.dashboard.assetManagement}?tab=user-assets-portfolio`)}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-primary-white p-5">
          <p className="mb-3 text-sm font-semibold text-text-black">Portfolio Information</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Customer name</span>
              <span className="font-medium text-text-black">{aggregate.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Portfolio ID</span>
              <span className="font-medium text-text-black">{aggregate.portfolioId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Portfolio Type</span>
              <span className="font-medium text-text-black">{ASSET_TYPE_LABELS[aggregate.assetType]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Date created:</span>
              <span className="font-medium text-text-black">{formatDate(aggregate.dateCreated)}</span>
            </div>
          </div>
        </div>

        <StatCard
          title="Portfolio Value"
          value={formatCurrency(aggregate.portfolioValue, aggregate.currencyCode)}
          trend="99.9%"
          period="Last 7 days"
          tone="positive"
        />

        <div className="rounded-2xl bg-primary-white p-5">
          <PortfolioValueDonut
            verifiedPercent={aggregate.verifiedPercent}
            verifiedAmount={formatCurrency(aggregate.verifiedValue, aggregate.currencyCode)}
            unverifiedPercent={aggregate.unverifiedPercent}
            unverifiedAmount={formatCurrency(aggregate.unverifiedValue, aggregate.currencyCode)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {userPortfolioDetailsTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-sm leading-tight md:text-base">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="w-full max-w-md">
          <TableSearchField placeholder="Search name or ID" />
        </div>

        {activeTabConfig.slots.content({ customerId, assetType, portfolioId })}
      </div>
    </div>
  );
}

export function UserPortfolioDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ portfolioId?: string }>();
  const { value } = useURLQuery<{ customerId?: string; type?: string }>();

  const portfolioId =
    params?.portfolioId && typeof params.portfolioId === "string" ? decodeURIComponent(params.portfolioId) : "";
  const customerId = value.customerId ?? "";
  const assetType = value.type ?? "";

  const canLoad = Boolean(portfolioId && customerId && assetType);
  const { data: aggregateResponse, isLoading } = useCustomerPortfolioAggregate(customerId, assetType);
  const handleBack = () => router.push(`${route.dashboard.assetManagement}?tab=user-assets-portfolio`);

  if (!canLoad) {
    return <BackToAssetManagement onBack={handleBack} />;
  }

  if (isLoading && !aggregateResponse) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="User Asset Portfolio"
          entityId={portfolioId}
          idPrefix=""
          onBack={handleBack}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Loading portfolio...
        </div>
      </div>
    );
  }

  if (!aggregateResponse) {
    return <BackToAssetManagement onBack={handleBack} />;
  }

  return (
    <UserPortfolioDetailsContent
      aggregate={aggregateResponse.data}
      customerId={customerId}
      assetType={assetType}
      portfolioId={portfolioId}
    />
  );
}
