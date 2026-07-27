"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { TableSearchField } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { mockUserAssetPortfolios } from "@/module/dashboard/asset-management/data";
import { USER_PORTFOLIO_DETAILS_TAB_COMPONENTS } from "@/module/dashboard/asset-management/user-portfolios/components/tab-table-components";
import { PortfolioValueDonut } from "@/module/dashboard/asset-management/user-portfolios/components/portfolio-value-donut";
import { UserPortfolioAssetsProvider, useUserPortfolioAssetsContext } from "@/module/dashboard/asset-management/user-portfolios/context";
import {
  DEFAULT_USER_PORTFOLIO_DETAILS_TAB,
  userPortfolioDetailsTabs,
  type UserPortfolioDetailsTabValue,
} from "@/module/dashboard/asset-management/user-portfolios/data";
import type { UserAssetPortfolioType } from "@/types/asset-management.type";
import { formatCurrency } from "@/util/format-currency";
import route from "@/util/route";

const ASSET_TYPE_LABELS: Record<UserAssetPortfolioType["assetType"], string> = {
  tangible: "Tangible Assets",
  digital: "Digital Assets",
};

function isUserPortfolioDetailsTab(value: string | null | undefined): value is UserPortfolioDetailsTabValue {
  return userPortfolioDetailsTabs.some((tab) => tab.value === value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function UserPortfolioDetailsContent({ portfolio }: { portfolio: UserAssetPortfolioType }) {
  const router = useRouter();
  const { assets } = useUserPortfolioAssetsContext();
  const { value, setURLQuery } = useURLQuery<{ tab?: string; q?: string }>();

  const activeTab = isUserPortfolioDetailsTab(value.tab) ? value.tab : DEFAULT_USER_PORTFOLIO_DETAILS_TAB;
  const activeTabConfig = USER_PORTFOLIO_DETAILS_TAB_COMPONENTS[activeTab];

  const portfolioValue = assets.reduce((sum, asset) => sum + asset.marketValue, 0);
  const verifiedValue = assets
    .filter((asset) => asset.status === "verified")
    .reduce((sum, asset) => sum + asset.marketValue, 0);
  const verifiedPercent = portfolioValue ? Math.round((verifiedValue / portfolioValue) * 1000) / 10 : 0;
  const unverifiedPercent = portfolioValue ? Math.round((100 - verifiedPercent) * 10) / 10 : 0;

  const handleTabChange = (nextTab: string) => {
    if (!isUserPortfolioDetailsTab(nextTab)) return;
    setURLQuery({ tab: nextTab, q: undefined });
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="User Asset Portfolio"
        entityId={portfolio.portfolioId}
        idPrefix=""
        onBack={() => router.push(`${route.dashboard.assetManagement}?tab=user-assets-portfolio`)}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-primary-white p-5">
          <p className="mb-3 text-sm font-semibold text-text-black">Portfolio Information</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Customer name</span>
              <span className="font-medium text-text-black">{portfolio.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Portfolio ID</span>
              <span className="font-medium text-text-black">{portfolio.portfolioId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Portfolio Type</span>
              <span className="font-medium text-text-black">{ASSET_TYPE_LABELS[portfolio.assetType]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-grey">Date created:</span>
              <span className="font-medium text-text-black">{formatDate(portfolio.createdAt)}</span>
            </div>
          </div>
        </div>

        <StatCard
          title="Portfolio Value"
          value={formatCurrency(portfolioValue, "USD")}
          trend="99.9%"
          period="Last 7 days"
          tone="positive"
        />

        <div className="rounded-2xl bg-primary-white p-5">
          <PortfolioValueDonut
            verifiedPercent={verifiedPercent}
            verifiedAmount={formatCurrency(verifiedValue, "USD")}
            unverifiedPercent={unverifiedPercent}
            unverifiedAmount={formatCurrency(portfolioValue - verifiedValue, "USD")}
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

        {activeTabConfig.slots.content(portfolio.portfolioId)}
      </div>
    </div>
  );
}

export function UserPortfolioDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ portfolioId?: string }>();
  const portfolioId =
    params?.portfolioId && typeof params.portfolioId === "string" ? decodeURIComponent(params.portfolioId) : "";

  const portfolio = mockUserAssetPortfolios.find((candidate) => candidate.portfolioId === portfolioId);

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">User asset portfolio not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() => router.push(`${route.dashboard.assetManagement}?tab=user-assets-portfolio`)}
        >
          Back to Asset Management
        </button>
      </div>
    );
  }

  return (
    <UserPortfolioAssetsProvider portfolioId={portfolio.portfolioId}>
      <UserPortfolioDetailsContent portfolio={portfolio} />
    </UserPortfolioAssetsProvider>
  );
}
