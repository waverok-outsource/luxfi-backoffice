"use client";

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { PortfolioInventoryAction } from "@/module/dashboard/portfolio-management/components/tab-actions/portfolio-inventory-action";
import { AssetBrandsTable } from "@/module/dashboard/portfolio-management/components/tables/asset-brands-table";
import { AssetCategoriesTable } from "@/module/dashboard/portfolio-management/components/tables/asset-categories-table";
import { AuditLogTable } from "@/module/dashboard/portfolio-management/components/tables/audit-log-table";
import { PortfolioInventoryTable } from "@/module/dashboard/portfolio-management/components/tables/portfolio-inventory-table";
import { PurchaseRequestsTable } from "@/module/dashboard/portfolio-management/components/tables/purchase-requests-table";
import { SaleRequestsTable } from "@/module/dashboard/portfolio-management/components/tables/sale-requests-table";
import type { PortfolioTabValue } from "@/module/dashboard/portfolio-management/data";

type PortfolioTabView = {
  slots: {
    filters?: () => ReactElement;
    action?: () => ReactElement;
    content: () => ReactElement;
  };
};

function TabActionButton({ label }: { label: string }) {
  return (
    <Button variant="default" className="h-12 rounded-2xl px-5">
      {label}
    </Button>
  );
}

function AssetBrandsAction() {
  return <TabActionButton label="Add New Brand" />;
}

function AssetCategoriesAction() {
  return <TabActionButton label="Add New Category" />;
}

export const PORTFOLIO_TAB_COMPONENTS: Record<PortfolioTabValue, PortfolioTabView> = {
  "portfolio-inventory": {
    slots: {
      action: PortfolioInventoryAction,
      content: PortfolioInventoryTable,
    },
  },
  "asset-brands": {
    slots: {
      action: AssetBrandsAction,
      content: AssetBrandsTable,
    },
  },
  "asset-categories": {
    slots: {
      action: AssetCategoriesAction,
      content: AssetCategoriesTable,
    },
  },
  "purchase-requests": {
    slots: {
      content: PurchaseRequestsTable,
    },
  },
  "sale-requests": {
    slots: {
      content: SaleRequestsTable,
    },
  },
  "audit-log": {
    slots: {
      content: AuditLogTable,
    },
  },
};
