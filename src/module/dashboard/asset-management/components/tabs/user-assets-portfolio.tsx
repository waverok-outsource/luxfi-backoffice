"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createTextColumn,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useCustomerOwnershipAggregates } from "@/services/queries/asset-management.queries";
import type { AssetClassAssetType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";
import route from "@/util/route";

type UserAssetPortfolioRow = Record<string, unknown> & {
  id: string;
  customerId: string;
  customerName: string;
  assetType: string;
  assetTypeLabel: string;
  portfolioValue: string;
  portfolioVolume: number;
  verifiedPercent: string;
  unverifiedPercent: string;
  currencyCode: string;
  dateCreated: string;
};

const PAGE_SIZE = 10;

const ASSET_TYPE_LABELS: Record<AssetClassAssetType, string> = {
  tangible: "Tangible Assets",
  digital: "Digital Assets",
};

export function UserAssetsPortfolioTab() {
  const router = useRouter();
  const { value } = useURLQuery<{ page?: string; q?: string; type?: string }>();

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}),
    ...(value.type && value.type !== "all" ? { assetType: value.type } : {}),
  });

  const { data: response, isLoading } = useCustomerOwnershipAggregates(query);
  const portfolios = response?.data ?? [];

  const rows: UserAssetPortfolioRow[] = portfolios.map((portfolio) => ({
    id: portfolio.portfolioId,
    customerId: portfolio.customerId,
    customerName: portfolio.customerName,
    assetType: portfolio.assetType,
    assetTypeLabel: ASSET_TYPE_LABELS[portfolio.assetType],
    portfolioValue: formatCurrency(portfolio.portfolioValue, portfolio.currencyCode),
    portfolioVolume: portfolio.portfolioVolume,
    verifiedPercent: `${portfolio.verifiedPercent}%`,
    unverifiedPercent: `${portfolio.unverifiedPercent}%`,
    currencyCode: portfolio.currencyCode,
    dateCreated: formatDate(portfolio.dateCreated, "dd/MM/yyyy"),
  }));

  const columns: ColumnDef<UserAssetPortfolioRow, unknown>[] = [
    createIdentifierColumn<UserAssetPortfolioRow>("Portfolio ID", "id"),
    createTextColumn<UserAssetPortfolioRow>("Customer Name", "customerName"),
    createTextColumn<UserAssetPortfolioRow>("Asset Type", "assetTypeLabel"),
    createTextColumn<UserAssetPortfolioRow>("Portfolio Value", "portfolioValue"),
    createTextColumn<UserAssetPortfolioRow>("Portfolio Volume", "portfolioVolume"),
    createTextColumn<UserAssetPortfolioRow>("Verified %", "verifiedPercent"),
    createTextColumn<UserAssetPortfolioRow>("Unverified %", "unverifiedPercent"),
    createTextColumn<UserAssetPortfolioRow>("Date Created", "dateCreated"),
    createActionColumnWithOptions<UserAssetPortfolioRow>({
      ariaLabel: "View user asset portfolio",
      onView: (row) => {
        router.push(
          `${route.dashboard.assetManagement}/user-portfolios/${row.id}?customerId=${row.customerId}&type=${row.assetType}&currency=${row.currencyCode}`,
        );
      },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={isLoading}
      emptyStateLabel="No user portfolios found."
      pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
    />
  );
}
