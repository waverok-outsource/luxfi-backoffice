"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  BaseTable,
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import {
  AssetTradeDetailsModal,
  type AssetTradeModalRow,
} from "@/module/dashboard/payments-settlements/components/modals/asset-trade-details-modal";
import {
  PAYMENTS_STATUS_CONFIG,
  normalizePaymentStatus,
} from "@/module/dashboard/payments-settlements/components/status-config";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useAssetPurchaseHistory } from "@/services/queries/payments.queries";
import type { AssetPurchaseHistoryItem } from "@/types/payments.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type AssetPurchaseRow = AssetPurchaseHistoryItem & { status: PaymentStatus };

export function AssetPurchaseHistoryTable() {
  const { value } = useURLQuery<{ page?: string; q?: string; from?: string; to?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedRow, setSelectedRow] = useState<AssetPurchaseRow | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: response, isLoading } = useAssetPurchaseHistory(query);
  const rows: AssetPurchaseRow[] = (response?.data ?? []).map((item) => ({
    ...item,
    status: normalizePaymentStatus(item.paymentStatus),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const columns: ColumnDef<AssetPurchaseRow, unknown>[] = [
    createSerialColumn<AssetPurchaseRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<AssetPurchaseRow>("Transaction ID", "transactionId"),
    createIdentifierColumn<AssetPurchaseRow>("Asset ID", "assetId"),
    {
      accessorKey: "transactionValue",
      header: "Transaction Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    createTextColumn<AssetPurchaseRow>("Seller", "seller"),
    createTextColumn<AssetPurchaseRow>("Pawn Representative", "pawnRepresentative"),
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => <span>{formatDate(row.original.date, "dd/MM/yyyy")}</span>,
    },
    createStatusColumn<AssetPurchaseRow, PaymentStatus>("Payment Status", PAYMENTS_STATUS_CONFIG),
    createActionColumnWithOptions<AssetPurchaseRow>({
      ariaLabel: "View asset purchase details",
      onView: setSelectedRow,
    }),
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Customer name or ID" />
        <BaseTable<AssetPurchaseRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? rows.length}
          pageSize={(response?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No asset purchases found."
        />
      </div>

      {selectedRow ? (
        <AssetTradeDetailsModal
          variant="purchase"
          open={Boolean(selectedRow)}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          row={toModalRow(selectedRow)}
        />
      ) : null}
    </>
  );
}

function toModalRow(row: AssetPurchaseRow): AssetTradeModalRow {
  return {
    id: row.id,
    logId: row.transactionId,
    transactionValue: row.transactionValue,
    date: row.date,
    status: row.status,
    partyId: row.sellerId,
    partyName: row.seller,
    representativeName: row.pawnRepresentative,
  };
}
