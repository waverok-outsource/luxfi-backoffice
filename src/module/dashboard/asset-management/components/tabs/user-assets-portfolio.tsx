"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createTextColumn,
} from "@/components/table";
import { mockUserAssetPortfolios } from "@/module/dashboard/asset-management/data";
import type { AssetClassAssetType } from "@/types/asset-management.type";
import { formatCurrency } from "@/util/format-currency";
import route from "@/util/route";

type UserAssetPortfolioRow = Record<string, unknown> & {
  id: string;
  customerName: string;
  assetType: string;
  portfolioValue: string;
  portfolioVolume: number;
  verifiedPercent: string;
  unverifiedPercent: string;
  createdAt: string;
};

const ASSET_TYPE_LABELS: Record<AssetClassAssetType, string> = {
  tangible: "Tangible Assets",
  digital: "Digital Assets",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function UserAssetsPortfolioTab() {
  const router = useRouter();

  const rows: UserAssetPortfolioRow[] = mockUserAssetPortfolios.map((portfolio) => ({
    id: portfolio.portfolioId,
    customerName: portfolio.customerName,
    assetType: ASSET_TYPE_LABELS[portfolio.assetType],
    portfolioValue: formatCurrency(portfolio.portfolioValue, "USD"),
    portfolioVolume: portfolio.portfolioVolume,
    verifiedPercent: `${portfolio.verifiedPercent}%`,
    unverifiedPercent: `${portfolio.unverifiedPercent}%`,
    createdAt: formatDate(portfolio.createdAt),
  }));

  const columns: ColumnDef<UserAssetPortfolioRow, unknown>[] = [
    createIdentifierColumn<UserAssetPortfolioRow>("Portfolio ID", "id"),
    createTextColumn<UserAssetPortfolioRow>("Customer Name", "customerName"),
    createTextColumn<UserAssetPortfolioRow>("Asset Type", "assetType"),
    createTextColumn<UserAssetPortfolioRow>("Portfolio Value", "portfolioValue"),
    createTextColumn<UserAssetPortfolioRow>("Portfolio Volume", "portfolioVolume"),
    createTextColumn<UserAssetPortfolioRow>("Verified %", "verifiedPercent"),
    createTextColumn<UserAssetPortfolioRow>("Unverified %", "unverifiedPercent"),
    createTextColumn<UserAssetPortfolioRow>("Date Created", "createdAt"),
    createActionColumnWithOptions<UserAssetPortfolioRow>({
      ariaLabel: "View user asset portfolio",
      onView: (row) => {
        router.push(`${route.dashboard.assetManagement}/user-portfolios/${row.id}`);
      },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      emptyStateLabel="No user portfolios found."
      pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
    />
  );
}
