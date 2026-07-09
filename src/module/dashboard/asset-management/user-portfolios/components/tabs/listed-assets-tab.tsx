"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
  type StatusConfig,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetVerificationModal } from "@/module/dashboard/asset-verification/asset-verification-modal";
import { useUserPortfolioAssetsContext } from "@/module/dashboard/asset-management/user-portfolios/context";
import { formatCurrency } from "@/util/format-currency";
import type { AssetVerificationRecord, AssetVerificationStatus } from "@/types/asset-verification.type";

type ListedAssetRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  assetCategory: string;
  dateAdded: string;
  marketValue: string;
  status: AssetVerificationStatus;
};

const STATUS_CONFIG: StatusConfig<AssetVerificationStatus> = {
  pending: { label: "Pending", variant: "warning" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "disabled" },
  notVerified: { label: "Not Verified", variant: "neutral" },
};

const AVAILABLE_STATUSES: AssetVerificationStatus[] = ["pending", "verified"];

function matchesQuery(asset: AssetVerificationRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return (
    !normalizedQuery ||
    asset.assetName.toLowerCase().includes(normalizedQuery) ||
    asset.assetId.toLowerCase().includes(normalizedQuery)
  );
}

export function ListedAssetsTab() {
  const { assets, updateAsset, blacklistAsset } = useUserPortfolioAssetsContext();
  const { value } = useURLQuery<{ q?: string }>();
  const [activeAssetId, setActiveAssetId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const filteredAssets = assets.filter((asset) => matchesQuery(asset, value.q ?? ""));

  const rows: ListedAssetRow[] = filteredAssets.map((asset) => ({
    id: asset.id,
    assetId: asset.assetId,
    assetName: asset.assetName,
    assetCategory: asset.assetCategoryName,
    dateAdded: asset.dateAddedLabel,
    marketValue: formatCurrency(asset.marketValue, "USD"),
    status: asset.status,
  }));

  const activeAsset = activeAssetId ? assets.find((asset) => asset.id === activeAssetId) ?? null : null;

  const columns: ColumnDef<ListedAssetRow, unknown>[] = [
    createIdentifierColumn<ListedAssetRow>("Asset ID", "assetId"),
    createTextColumn<ListedAssetRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<ListedAssetRow>("Asset Category", "assetCategory"),
    createTextColumn<ListedAssetRow>("Date Added", "dateAdded"),
    createTextColumn<ListedAssetRow>("Market Value", "marketValue"),
    createStatusColumn<ListedAssetRow, AssetVerificationStatus>("Status ID", STATUS_CONFIG),
    createActionColumnWithOptions<ListedAssetRow>({
      ariaLabel: "View asset information",
      onView: (row) => {
        setActiveAssetId(row.id);
        setModalOpen(true);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No data available"
        pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
      />

      {activeAsset ? (
        <AssetVerificationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          asset={activeAsset}
          availableStatuses={AVAILABLE_STATUSES}
          enableBlacklist
          onSave={updateAsset}
          onBlacklist={blacklistAsset}
        />
      ) : null}
    </>
  );
}
