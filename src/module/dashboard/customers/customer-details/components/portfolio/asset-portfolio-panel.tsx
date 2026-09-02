"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetPortfolioModal } from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal";
import { useCustomerAssets } from "@/services/queries/customer-asset.queries";
import type { CustomerAssetStatus } from "@/types/customer-asset.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, resolveAssetClassLabel } from "@/util/helper";

const PAGE_SIZE = 5;

type TableRow = {
  id: string;
  assetId: string;
  assetClass: string;
  assetName: string;
  marketValue: string;
  pawnValue: string;
  dateAppliedLabel: string;
  status: CustomerAssetStatus;
};

function getTableStatusBadge(status: CustomerAssetStatus) {
  switch (status) {
    case "pending":
      return { variant: "warning" as const, label: "Pending" };
    case "verified":
      return { variant: "success" as const, label: "Verified" };
    case "rejected":
      return { variant: "error" as const, label: "Rejected" };
    case "notVerified":
      return { variant: "disabled" as const, label: "Not Verified" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

export function AssetPortfolioPanel({ customerId }: { customerId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useCustomerAssets(customerId, query);
  const assets = React.useMemo(() => response?.data ?? [], [response?.data]);

  const [activeAssetId, setActiveAssetId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const activeAsset = React.useMemo(
    () => (activeAssetId ? (assets.find((a) => a.assetId === activeAssetId) ?? null) : null),
    [activeAssetId, assets],
  );

  const rows: TableRow[] = React.useMemo(
    () =>
      assets.map((asset) => ({
        id: asset.assetId,
        assetId: asset.assetId,
        assetClass: resolveAssetClassLabel(asset),
        assetName: asset.name,
        marketValue: formatCurrency(asset.price.value, asset.price.currencyCode),
        pawnValue: asset.pawnValuationPrice
          ? formatCurrency(asset.pawnValuationPrice.value, asset.pawnValuationPrice.currencyCode)
          : "-",
        dateAppliedLabel: formatDate(asset.createdAt, "dd/MM/yyyy"),
        status: asset.status,
      })),
    [assets],
  );

  const columns = React.useMemo<ColumnDef<TableRow, unknown>[]>(
    () => [
      createSerialColumn<TableRow>(),
      createIdentifierColumn<TableRow>("Asset ID", "assetId"),
      {
        accessorKey: "assetClass",
        header: "Asset Class",
      },
      {
        accessorKey: "assetName",
        header: "Asset Name",
      },
      {
        accessorKey: "marketValue",
        header: "Market Value",
      },
      {
        accessorKey: "pawnValue",
        header: "Pawn Value",
      },
      {
        accessorKey: "dateAppliedLabel",
        header: "Date Applied",
      },
      {
        accessorKey: "status",
        header: "Status ID",
        cell: ({ getValue }) => {
          const badge = getTableStatusBadge(getValue() as CustomerAssetStatus);
          return (
            <Badge variant={badge.variant} showStatusDot>
              {badge.label}
            </Badge>
          );
        },
      },
      createActionColumnWithOptions<TableRow>({
        ariaLabel: "View customer asset information",
        onView: (row) => {
          setActiveAssetId(row.id);
          setModalOpen(true);
        },
      }),
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <TableSearchToolbar placeholder="Search Asset ID" />

      <DataTable<TableRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        enableCheckbox
        pagination={{
          totalEntries: response?.pagination.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      <AssetPortfolioModal open={modalOpen} onOpenChange={setModalOpen} asset={activeAsset} />
    </div>
  );
}
