"use client";

import type { ReactElement } from "react";

import { AssetBrandsTable } from "@/module/dashboard/portfolio-management/components/tables/asset-brands-table";
import { AssetCategoriesTable } from "@/module/dashboard/portfolio-management/components/tables/asset-categories-table";
import { AuditLogTable } from "@/module/dashboard/portfolio-management/components/tables/audit-log-table";
import { PortfolioInventoryTable } from "@/module/dashboard/portfolio-management/components/tables/portfolio-inventory-table";
import { PurchaseRequestsTable } from "@/module/dashboard/portfolio-management/components/tables/purchase-requests-table";
import { SaleRequestsTable } from "@/module/dashboard/portfolio-management/components/tables/sale-requests-table";
import type { PortfolioTabValue } from "@/module/dashboard/portfolio-management/data";

export const PORTFOLIO_TAB_COMPONENTS: Record<PortfolioTabValue, () => ReactElement> = {
  "portfolio-inventory": PortfolioInventoryTable,
  "asset-brands": AssetBrandsTable,
  "asset-categories": AssetCategoriesTable,
  "purchase-requests": PurchaseRequestsTable,
  "sale-requests": SaleRequestsTable,
  "audit-log": AuditLogTable,
};
