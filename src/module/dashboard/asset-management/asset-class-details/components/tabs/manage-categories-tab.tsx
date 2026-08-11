"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetCategoryConfigurationModal } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-category-configuration-modal";
import { ASSET_CATEGORY_STATUS_CONFIG } from "@/module/dashboard/asset-management/asset-class-details/data";
import { useAssetCategories } from "@/services/queries/asset-management.queries";
import type { AssetCategoryStatus, AssetCategoryType, AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type AssetCategoryTableRow = Record<string, unknown> & {
  id: string;
  categoryName: string;
  status: AssetCategoryStatus;
};

type ManageCategoriesTabProps = {
  assetClass: AssetClassType;
};

export function ManageCategoriesTab({ assetClass }: ManageCategoriesTabProps) {
  const { value } = useURLQuery<{ q?: string }>();
  const [editingCategory, setEditingCategory] = React.useState<AssetCategoryType | null>(null);

  const searchQuery = (value.q ?? "").trim();
  const categoriesQuery = convertObjectToQuery({
    assetClassId: assetClass.classId,
    ...(searchQuery ? { q: searchQuery } : {}),
  });

  const { data: categoriesResponse, isLoading } = useAssetCategories(categoriesQuery);
  const categories = categoriesResponse?.data ?? [];

  const rows: AssetCategoryTableRow[] = categories.map((category) => ({
    id: category.reference,
    categoryName: category.name,
    status: category.status,
  }));

  const columns: ColumnDef<AssetCategoryTableRow, unknown>[] = [
    createIdentifierColumn<AssetCategoryTableRow>("Category ID", "id"),
    createTextColumn<AssetCategoryTableRow>("Category Name", "categoryName"),
    createStatusColumn<AssetCategoryTableRow, AssetCategoryStatus>("Status", ASSET_CATEGORY_STATUS_CONFIG),
    createActionColumnWithOptions<AssetCategoryTableRow>({
      onView: (row) => {
        const category = categories.find((candidate) => candidate.reference === row.id);
        if (category) {
          setEditingCategory(category);
        }
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No categories found."
        pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
      />

      {editingCategory && (
        <AssetCategoryConfigurationModal
          mode="edit"
          open={Boolean(editingCategory)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null);
            }
          }}
          assetClass={assetClass}
          assetCategory={editingCategory}
        />
      )}
    </>
  );
}
