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
import { LISTING_STATUS_CONFIG } from "@/module/dashboard/asset-management/asset-class-details/data";
import { useAssets } from "@/services/queries/asset-management.queries";
import type { AssetClassType, AssetItemListingStatus } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type AssetItemTableRow = Record<string, unknown> & {
  id: string;
  assetName: string;
  dial: string;
  itemColor: string;
  year: string;
  status: AssetItemListingStatus;
};

type ManageAssetsTabProps = {
  assetClass: AssetClassType;
};

export function ManageAssetsTab({ assetClass }: ManageAssetsTabProps) {
  const { value } = useURLQuery<{ q?: string; category?: string; year?: string }>();
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  const { data: assetsResponse } = useAssets(
    convertObjectToQuery({
      assetClassId: assetClass.assetClassId,
      ...(value.q ? { q: value.q } : {}),
      ...(value.category && value.category !== "all" ? { assetCategoryId: value.category } : {}),
      ...(value.year && value.year !== "all" ? { productionYear: value.year } : {}),
    }),
  );

  const items = assetsResponse?.data ?? [];
  const editingItem = items.find((item) => item.assetId === editingItemId) ?? null;

  const rows: AssetItemTableRow[] = items.map((item) => ({
    id: item.assetId,
    assetName: item.name,
    dial: item.dialColour,
    itemColor: item.case.colour,
    year: item.productionYear,
    // The real GET response has no "listing status" field — derived from `onSale`.
    status: item.onSale ? "listed" : "unlisted",
  }));

  const columns: ColumnDef<AssetItemTableRow, unknown>[] = [
    createIdentifierColumn<AssetItemTableRow>("Asset ID", "id"),
    createTextColumn<AssetItemTableRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<AssetItemTableRow>("Dial", "dial"),
    createTextColumn<AssetItemTableRow>("Item Color", "itemColor"),
    createTextColumn<AssetItemTableRow>("Year", "year"),
    createStatusColumn<AssetItemTableRow, AssetItemListingStatus>(
      "Listing Status",
      LISTING_STATUS_CONFIG,
    ),
    createActionColumnWithOptions<AssetItemTableRow>({
      onView: (row) => setEditingItemId(row.id),
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
              setEditingItemId(null);
            }
          }}
          assetClass={assetClass}
          assetItem={editingItem}
        />
      )}
    </>
  );
}
