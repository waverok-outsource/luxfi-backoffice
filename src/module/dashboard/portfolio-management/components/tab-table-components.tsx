"use client";

import type { ReactElement } from "react";

import { AssetBrandsAction } from "@/module/dashboard/portfolio-management/components/tab-actions/asset-brands-action";
import { AssetCategoriesAction } from "@/module/dashboard/portfolio-management/components/tab-actions/asset-categories-action";
import { PortfolioInventoryAction } from "@/module/dashboard/portfolio-management/components/tab-actions/portfolio-inventory-action";
import { AssetBrandsTable } from "@/module/dashboard/portfolio-management/components/tables/asset-brands-table";
import { AssetCategoriesTable } from "@/module/dashboard/portfolio-management/components/tables/asset-categories-table";
import { AuditLogTable } from "@/module/dashboard/portfolio-management/components/tables/audit-log-table";
import { PortfolioInventoryTable } from "@/module/dashboard/portfolio-management/components/tables/portfolio-inventory-table";
import { RequestsTable } from "@/module/dashboard/portfolio-management/components/tables/requests-table";
import type { PortfolioTabValue } from "@/module/dashboard/portfolio-management/data";

type PortfolioTabView = {
  slots: {
    filters?: () => ReactElement;
    action?: () => ReactElement;
    content: () => ReactElement;
  };
};

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
      content: () => <RequestsTable variant="purchase" />,
    },
  },
  "sale-requests": {
    slots: {
      content: () => <RequestsTable variant="sale" />,
    },
  },
  "audit-log": {
    slots: {
      content: AuditLogTable,
    },
  },
};
