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
import { useAssetSalesHistory } from "@/services/queries/payments.queries";
import type { AssetSaleHistoryItem } from "@/types/payments.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type AssetSaleRow = AssetSaleHistoryItem & { status: PaymentStatus };

export function AssetSalesHistoryTable() {
  const { value } = useURLQuery<{ page?: string; q?: string; from?: string; to?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedRow, setSelectedRow] = useState<AssetSaleRow | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: response, isLoading } = useAssetSalesHistory(query);
  const rows: AssetSaleRow[] = (response?.data ?? []).map((item) => ({
    ...item,
    status: normalizePaymentStatus(item.paymentStatus),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const columns: ColumnDef<AssetSaleRow, unknown>[] = [
    createSerialColumn<AssetSaleRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<AssetSaleRow>("Transaction ID", "transactionId"),
    createIdentifierColumn<AssetSaleRow>("Asset ID", "assetId"),
    createTextColumn<AssetSaleRow>("Asset", "asset"),
    {
      accessorKey: "transactionValue",
      header: "Transaction Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    createTextColumn<AssetSaleRow>("Buyer", "buyer"),
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => <span>{formatDate(row.original.date, "dd/MM/yyyy")}</span>,
    },
    createStatusColumn<AssetSaleRow, PaymentStatus>("Payment Status", PAYMENTS_STATUS_CONFIG),
    createActionColumnWithOptions<AssetSaleRow>({
      ariaLabel: "View asset sale details",
      onView: setSelectedRow,
    }),
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Customer name or ID" />
        <BaseTable<AssetSaleRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? rows.length}
          pageSize={(response?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No asset sales found."
        />
      </div>

      {selectedRow ? (
        <AssetTradeDetailsModal
          variant="sale"
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

function toModalRow(row: AssetSaleRow): AssetTradeModalRow {
  return {
    id: row.id,
    logId: row.transactionId,
    transactionValue: row.transactionValue,
    date: row.date,
    status: row.status,
    partyId: row.buyerId,
    partyName: row.buyer,
  };
}
