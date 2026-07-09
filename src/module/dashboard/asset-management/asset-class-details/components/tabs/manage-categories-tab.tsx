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
import { useAssetCategoriesContext } from "@/module/dashboard/asset-management/asset-class-details/context";
import { LISTING_STATUS_CONFIG } from "@/module/dashboard/asset-management/asset-class-details/data";
import type { AssetCategoryType, AssetClassType, AssetItemListingStatus } from "@/types/asset-management.type";

type AssetCategoryTableRow = Record<string, unknown> & {
  id: string;
  categoryName: string;
  status: AssetItemListingStatus;
};

function matchesQuery(category: AssetCategoryType, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return (
    !normalizedQuery ||
    category.name.toLowerCase().includes(normalizedQuery) ||
    category.assetCategoryId.toLowerCase().includes(normalizedQuery)
  );
}

type ManageCategoriesTabProps = {
  assetClass: AssetClassType;
};

export function ManageCategoriesTab({ assetClass }: ManageCategoriesTabProps) {
  const { categories, updateCategory, removeCategory } = useAssetCategoriesContext();
  const { value } = useURLQuery<{ q?: string }>();
  const [editingCategory, setEditingCategory] = React.useState<AssetCategoryType | null>(null);

  const filteredCategories = categories.filter((category) => matchesQuery(category, value.q ?? ""));

  const rows: AssetCategoryTableRow[] = filteredCategories.map((category) => ({
    id: category.assetCategoryId,
    categoryName: category.name,
    status: category.listingStatus,
  }));

  const columns: ColumnDef<AssetCategoryTableRow, unknown>[] = [
    createIdentifierColumn<AssetCategoryTableRow>("Category ID", "id"),
    createTextColumn<AssetCategoryTableRow>("Category Name", "categoryName"),
    createStatusColumn<AssetCategoryTableRow, AssetItemListingStatus>("Listing Status", LISTING_STATUS_CONFIG),
    createActionColumnWithOptions<AssetCategoryTableRow>({
      onView: (row) => {
        const category = categories.find((candidate) => candidate.assetCategoryId === row.id);
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
          onAssetCategoryUpdated={updateCategory}
          onAssetCategoryDeleted={removeCategory}
        />
      )}
    </>
  );
}
