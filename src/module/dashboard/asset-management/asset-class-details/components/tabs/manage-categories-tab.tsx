"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ASSET_CATEGORY_STATUS_CONFIG } from "@/module/dashboard/asset-management/asset-class-details/data";
import { useAssetCategories } from "@/services/queries/asset-management.queries";
import type { AssetCategoryStatus, AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import route from "@/util/route";

type AssetCategoryTableRow = Record<string, unknown> & {
  id: string;
  categoryName: string;
  brandsCount: number;
  assetsCount: number;
  overrideConfig: string;
  status: AssetCategoryStatus;
};

type ManageCategoriesTabProps = {
  assetClass: AssetClassType;
};

export function ManageCategoriesTab({ assetClass }: ManageCategoriesTabProps) {
  const router = useRouter();
  const { value } = useURLQuery<{ q?: string }>();

  const searchQuery = (value.q ?? "").trim();
  const categoriesQuery = convertObjectToQuery({
    assetClassId: assetClass.assetClassId,
    ...(searchQuery ? { q: searchQuery } : {}),
  });

  const { data: categoriesResponse, isLoading } = useAssetCategories(categoriesQuery);
  const categories = categoriesResponse?.data ?? [];

  const rows: AssetCategoryTableRow[] = categories.map((category) => ({
    id: category.assetCategoryId,
    categoryName: category.name,
    brandsCount: category.brandsCount ?? 0,
    assetsCount: category.assetsCount,
    overrideConfig: category.overrideParentClassConfigurations ? "Yes" : "No",
    status: category.status,
  }));

  const columns: ColumnDef<AssetCategoryTableRow, unknown>[] = [
    createIdentifierColumn<AssetCategoryTableRow>("Category ID", "id"),
    createTextColumn<AssetCategoryTableRow>("Category Name", "categoryName"),
    createTextColumn<AssetCategoryTableRow>("Brands", "brandsCount"),
    createTextColumn<AssetCategoryTableRow>("Assets", "assetsCount"),
    createTextColumn<AssetCategoryTableRow>("Override Config", "overrideConfig"),
    createStatusColumn<AssetCategoryTableRow, AssetCategoryStatus>(
      "Status",
      ASSET_CATEGORY_STATUS_CONFIG,
    ),
    createActionColumnWithOptions<AssetCategoryTableRow>({
      ariaLabel: "View category details",
      onView: (row) => {
        const category = categories.find((candidate) => candidate.assetCategoryId === row.id);
        if (category) {
          router.push(
            route.dashboard.assetCategory(assetClass.assetClassId, category.assetCategoryId),
          );
        }
      },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={isLoading}
      emptyStateLabel="No categories found."
      pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
    />
  );
}
