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
import { AssetPortfolioModal } from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal";
import { useCustomerAssets } from "@/services/queries/customer-asset.queries";
import type { CustomerAssetStatus } from "@/types/customer-asset.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, resolveAssetClassLabel } from "@/util/helper";

type ListedAssetRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  assetClass: string;
  dateAdded: string;
  marketValue: string;
  status: CustomerAssetStatus;
};

const STATUS_CONFIG: StatusConfig<CustomerAssetStatus> = {
  pending: { label: "Pending", variant: "warning" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "disabled" },
  notVerified: { label: "Not Verified", variant: "neutral" },
};

const PAGE_SIZE = 10;

function toVerificationStatus(status: string | undefined): CustomerAssetStatus {
  return status === "verified" || status === "rejected" || status === "notVerified" || status === "pending"
    ? status
    : "pending";
}

type ListedAssetsTabProps = {
  customerId: string;
  assetType: string;
};

export function ListedAssetsTab({ customerId, assetType }: ListedAssetsTabProps) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeAssetId, setActiveAssetId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}),
    assetType,
  });

  const { data: response, isLoading } = useCustomerAssets(customerId, query);
  const assets = response?.data ?? [];

  const rows: ListedAssetRow[] = assets.map((asset) => ({
    id: asset.assetId,
    assetId: asset.assetId,
    assetName: asset.name,
    assetClass: resolveAssetClassLabel(asset),
    dateAdded: formatDate(asset.createdAt, "dd/MM/yyyy"),
    marketValue: formatCurrency(asset.price.value, asset.price.currencyCode),
    status: toVerificationStatus(asset.verificationStatus ?? asset.status),
  }));

  const activeAsset = activeAssetId
    ? (assets.find((asset) => asset.assetId === activeAssetId) ?? null)
    : null;

  const columns: ColumnDef<ListedAssetRow, unknown>[] = [
    createIdentifierColumn<ListedAssetRow>("Asset ID", "assetId"),
    createTextColumn<ListedAssetRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<ListedAssetRow>("Asset Class", "assetClass"),
    createTextColumn<ListedAssetRow>("Date Added", "dateAdded"),
    createTextColumn<ListedAssetRow>("Market Value", "marketValue"),
    createStatusColumn<ListedAssetRow, CustomerAssetStatus>("Status ID", STATUS_CONFIG),
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
        loading={isLoading}
        emptyStateLabel="No listed assets found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      <AssetPortfolioModal open={modalOpen} onOpenChange={setModalOpen} asset={activeAsset} />
    </>
  );
}
