"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  PortfolioBaseTable,
  createActionColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";
import { usePortfolioAssets } from "@/services/queries/portfolio.queries";
import type { PortfolioInventoryAssetType } from "@/types/portfolio.type";
import { formatCurrency } from "@/util/format-currency";
import { getSerialNumberOffset, toTitleCase } from "@/util/helper";
import { normalizePortfolioStatus } from "@/util/normalize-portfolio-status";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import type { PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";

const PAGE_SIZE = 10;
const FALLBACK_TEXT = "-";

function resolveAssetName(asset: PortfolioInventoryAssetType) {
  return (
    asset.assetName || asset.name || (asset.categoryName ? toTitleCase(asset.categoryName) : FALLBACK_TEXT)
  );
}

function resolveAssetBrand(asset: PortfolioInventoryAssetType) {
  return asset.assetBrand || asset.brandName || FALLBACK_TEXT;
}

export function PortfolioInventoryTable() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const assetsQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: assetsResponse, isLoading } = usePortfolioAssets(assetsQuery);
  const rows: PortfolioTableRow[] = (assetsResponse?.data ?? []).map((asset) => ({
    id: asset.assetId || asset.assetRef,
    assetName: resolveAssetName(asset),
    assetCategory: asset.categoryName ? toTitleCase(asset.categoryName) : FALLBACK_TEXT,
    assetBrand: resolveAssetBrand(asset),
    priceValue: formatCurrency(asset.price, asset.currencyCode?.toUpperCase()),
    status: normalizePortfolioStatus(asset.status, { onSale: asset.onSale }),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: assetsResponse?.pagination,
  });

  const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
    createSerialColumn({ offset: serialNumberOffset }),
    createIdentifierColumn("Asset ID", "id"),
    createTextColumn("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn("Asset Category", "assetCategory"),
    createTextColumn("Asset Brand", "assetBrand"),
    createTextColumn("Price Value", "priceValue"),
    createStatusColumn("Listing Status"),
    createActionColumn(),
  ];

  return (
    <PortfolioBaseTable
      rows={rows}
      columns={columns}
      pageSize={(assetsResponse?.pagination?.perPage ?? PAGE_SIZE) || 1}
      totalEntries={assetsResponse?.pagination?.total ?? rows.length}
      loading={isLoading}
      emptyStateLabel="No assets found."
    />
  );
}
