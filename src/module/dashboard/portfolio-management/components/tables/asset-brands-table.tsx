"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { AddAssetBrandModal } from "@/module/dashboard/portfolio-management/components/modals/add-asset-brand-modal";
import {
  PortfolioBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";
import type { PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";
import { usePortfolioAssetBrands } from "@/services/queries/portfolio.queries";
import type { PortfolioAssetBrandType } from "@/types/portfolio.type";
import { getSerialNumberOffset, toTitleCase } from "@/util/helper";
import { normalizePortfolioStatus } from "@/util/normalize-portfolio-status";
import convertObjectToQuery from "@/util/convertObjectToQuery";

const PAGE_SIZE = 10;
const FALLBACK_TEXT = "-";

export function AssetBrandsTable() {
  const [isEditBrandOpen, setIsEditBrandOpen] = React.useState(false);
  const [selectedBrand, setSelectedBrand] = React.useState<{
    brandId: string;
    brandName: string;
    categoryId: string;
    rawStatus: string;
  } | null>(null);

  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const brandsQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: brandsResponse, isLoading } = usePortfolioAssetBrands(brandsQuery);
  const rows: PortfolioTableRow[] = (brandsResponse?.data ?? []).map((brand: PortfolioAssetBrandType) => ({
    id: brand.brandId,
    brandName: brand.name ? toTitleCase(brand.name) : FALLBACK_TEXT,
    categoryId: brand.categoryId || "",
    category: brand.categoryName ? toTitleCase(brand.categoryName) : FALLBACK_TEXT,
    assetCount: brand.assetsCount,
    rawStatus: brand.status || "",
    status: normalizePortfolioStatus(brand.status),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: brandsResponse?.pagination,
  });

  const openEditBrandModal = (row: PortfolioTableRow) => {
    setSelectedBrand({
      brandId: String(row.id ?? ""),
      brandName: String(row.brandName ?? ""),
      categoryId: String(row.categoryId ?? ""),
      rawStatus: String(row.rawStatus ?? ""),
    });
    setIsEditBrandOpen(true);
  };

  const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
    createSerialColumn({ offset: serialNumberOffset }),
    createIdentifierColumn("Brand ID", "id"),
    createTextColumn("Brand Name", "brandName"),
    createTextColumn("Category", "category", "max-w-[130px]"),
    createTextColumn("Asset Count", "assetCount"),
    createStatusColumn("Listing Status"),
    createActionColumnWithOptions({
      ariaLabel: "View brand details",
      onView: openEditBrandModal,
    }),
  ];

  return (
    <>
      <PortfolioBaseTable
        rows={rows}
        columns={columns}
        pageSize={(brandsResponse?.pagination?.perPage ?? PAGE_SIZE) || 1}
        totalEntries={brandsResponse?.pagination?.total ?? rows.length}
        loading={isLoading}
        emptyStateLabel="No asset brands found."
      />

      {isEditBrandOpen && selectedBrand ? (
        <AddAssetBrandModal
          open={isEditBrandOpen}
          onOpenChange={(open) => {
            setIsEditBrandOpen(open);
            if (!open) {
              setSelectedBrand(null);
            }
          }}
          mode="edit"
          brand={{
            brandId: selectedBrand.brandId,
            brandName: selectedBrand.brandName,
            categoryId: selectedBrand.categoryId,
            isPublished: selectedBrand.rawStatus.toLowerCase() === "published",
          }}
        />
      ) : null}
    </>
  );
}
