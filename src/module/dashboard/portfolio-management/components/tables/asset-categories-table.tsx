"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { AddAssetCategoryModal } from "@/module/dashboard/portfolio-management/components/modals/add-asset-category-modal";
import {
  PortfolioBaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/module/dashboard/portfolio-management/components/tables/shared";
import type { PortfolioTableRow } from "@/module/dashboard/portfolio-management/data";
import { usePortfolioAssetCategories } from "@/services/queries/portfolio.queries";
import type { PortfolioAssetCategoryType } from "@/types/portfolio.type";
import { getSerialNumberOffset, toTitleCase } from "@/util/helper";
import { normalizePortfolioStatus } from "@/util/normalize-portfolio-status";
import convertObjectToQuery from "@/util/convertObjectToQuery";

const PAGE_SIZE = 10;
const FALLBACK_TEXT = "-";

export function AssetCategoriesTable() {
  const [isEditCategoryOpen, setIsEditCategoryOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<{
    categoryId: string;
    categoryName: string;
    rawCategoryName: string;
    rawStatus: string;
  } | null>(null);

  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const categoriesQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: categoriesResponse, isLoading } = usePortfolioAssetCategories(categoriesQuery);
  const rows: PortfolioTableRow[] = (categoriesResponse?.data ?? []).map(
    (category: PortfolioAssetCategoryType) => ({
      id: category.categoryId,
      categoryName: category.name ? toTitleCase(category.name) : FALLBACK_TEXT,
      rawCategoryName: category.name || "",
      brands: category.brandsCount ?? category.assetsCount ?? 0,
      rawStatus: category.status || "",
      status: normalizePortfolioStatus(category.status),
    }),
  );

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: categoriesResponse?.pagination,
  });

  const openEditCategoryModal = (row: PortfolioTableRow) => {
    setSelectedCategory({
      categoryId: String(row.id ?? ""),
      categoryName: String(row.categoryName ?? ""),
      rawCategoryName: String(row.rawCategoryName ?? row.categoryName ?? ""),
      rawStatus: String(row.rawStatus ?? ""),
    });
    setIsEditCategoryOpen(true);
  };

  const columns: ColumnDef<PortfolioTableRow, unknown>[] = [
    createSerialColumn({ offset: serialNumberOffset }),
    createIdentifierColumn("Category ID", "id"),
    createTextColumn("Category Name", "categoryName"),
    createTextColumn("Brands", "brands"),
    createStatusColumn("Listing Status"),
    createActionColumnWithOptions({
      ariaLabel: "View category details",
      onView: openEditCategoryModal,
    }),
  ];

  return (
    <>
      <PortfolioBaseTable
        rows={rows}
        columns={columns}
        pageSize={(categoriesResponse?.pagination?.perPage ?? PAGE_SIZE) || 1}
        totalEntries={categoriesResponse?.pagination?.total ?? rows.length}
        loading={isLoading}
        emptyStateLabel="No asset categories found."
      />

      {isEditCategoryOpen && selectedCategory && (
        <AddAssetCategoryModal
          open={isEditCategoryOpen}
          onOpenChange={(open) => {
            setIsEditCategoryOpen(open);
            if (!open) {
              setSelectedCategory(null);
            }
          }}
          mode="edit"
          category={{
            categoryId: selectedCategory.categoryId,
            categoryName: selectedCategory.categoryName,
            originalCategoryName: selectedCategory.rawCategoryName,
            isPublished: selectedCategory.rawStatus.toLowerCase() === "published",
          }}
        />
      )}
    </>
  );
}
