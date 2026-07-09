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
import { AssetItemConfigurationModal } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal";
import { useAssetItemsContext } from "@/module/dashboard/asset-management/asset-class-details/context";
import { LISTING_STATUS_CONFIG } from "@/module/dashboard/asset-management/asset-class-details/data";
import type { AssetClassType, AssetItemListingStatus, AssetItemType } from "@/types/asset-management.type";

type AssetItemTableRow = Record<string, unknown> & {
  id: string;
  assetName: string;
  assetCategory: string;
  dial: string;
  itemColor: string;
  year: string;
  status: AssetItemListingStatus;
};

function matchesFilters(item: AssetItemType, query: string, category: string, year: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery =
    !normalizedQuery ||
    item.name.toLowerCase().includes(normalizedQuery) ||
    item.assetItemId.toLowerCase().includes(normalizedQuery);
  const matchesCategory = category === "all" || item.assetCategoryName === category;
  const matchesYear = year === "all" || item.year === year;

  return matchesQuery && matchesCategory && matchesYear;
}

type ManageAssetsTabProps = {
  assetClass: AssetClassType;
};

export function ManageAssetsTab({ assetClass }: ManageAssetsTabProps) {
  const { items, updateItem, removeItem } = useAssetItemsContext();
  const { value } = useURLQuery<{ q?: string; category?: string; year?: string }>();
  const [editingItem, setEditingItem] = React.useState<AssetItemType | null>(null);

  const filteredItems = items.filter((item) =>
    matchesFilters(item, value.q ?? "", value.category ?? "all", value.year ?? "all"),
  );

  const rows: AssetItemTableRow[] = filteredItems.map((item) => ({
    id: item.assetItemId,
    assetName: item.name,
    assetCategory: item.assetCategoryName,
    dial: item.dialColour,
    itemColor: item.caseColour,
    year: item.year,
    status: item.listingStatus,
  }));

  const columns: ColumnDef<AssetItemTableRow, unknown>[] = [
    createIdentifierColumn<AssetItemTableRow>("Asset ID", "id"),
    createTextColumn<AssetItemTableRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<AssetItemTableRow>("Asset Category", "assetCategory"),
    createTextColumn<AssetItemTableRow>("Dial", "dial"),
    createTextColumn<AssetItemTableRow>("Item Color", "itemColor"),
    createTextColumn<AssetItemTableRow>("Year", "year"),
    createStatusColumn<AssetItemTableRow, AssetItemListingStatus>(
      "Listing Status",
      LISTING_STATUS_CONFIG,
    ),
    createActionColumnWithOptions<AssetItemTableRow>({
      onView: (row) => {
        const item = items.find((candidate) => candidate.assetItemId === row.id);
        if (item) {
          setEditingItem(item);
        }
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No assets found."
        pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
      />

      {editingItem && (
        <AssetItemConfigurationModal
          mode="edit"
          open={Boolean(editingItem)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingItem(null);
            }
          }}
          assetClass={assetClass}
          assetItem={editingItem}
          onAssetItemUpdated={updateItem}
          onAssetItemDeleted={removeItem}
        />
      )}
    </>
  );
}
