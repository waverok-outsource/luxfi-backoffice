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
  WalletDepositDetailsModal,
  type WalletDepositModalRow,
} from "@/module/dashboard/payments-settlements/components/modals/wallet-deposit-details-modal";
import {
  PAYMENTS_STATUS_CONFIG,
  normalizePaymentStatus,
} from "@/module/dashboard/payments-settlements/components/status-config";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useCustomerDeposits } from "@/services/queries/payments.queries";
import type { CustomerDepositItem } from "@/types/payments.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type CustomerDepositRow = CustomerDepositItem & { status: PaymentStatus };

export function CustomerWalletDepositsTable() {
  const { value } = useURLQuery<{ page?: string; q?: string; from?: string; to?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedRow, setSelectedRow] = useState<CustomerDepositRow | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: response, isLoading } = useCustomerDeposits(query);
  const rows: CustomerDepositRow[] = (response?.data ?? []).map((item) => ({
    ...item,
    status: normalizePaymentStatus(item.status),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const columns: ColumnDef<CustomerDepositRow, unknown>[] = [
    createSerialColumn<CustomerDepositRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<CustomerDepositRow>("Transaction ID", "transactionId"),
    createIdentifierColumn<CustomerDepositRow>("Customer ID", "customerId"),
    {
      accessorKey: "depositValue",
      header: "Deposit Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    createIdentifierColumn<CustomerDepositRow>("Wallet ID", "walletId"),
    createTextColumn<CustomerDepositRow>("Currency", "currency"),
    {
      id: "date",
      header: "Transaction Date",
      cell: ({ row }) => <span>{formatDate(row.original.transactionDate, "dd/MM/yyyy")}</span>,
    },
    createStatusColumn<CustomerDepositRow, PaymentStatus>("Status ID", PAYMENTS_STATUS_CONFIG),
    createActionColumnWithOptions<CustomerDepositRow>({
      ariaLabel: "View wallet deposit details",
      onView: setSelectedRow,
    }),
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Customer name or ID" />
        <BaseTable<CustomerDepositRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? rows.length}
          pageSize={(response?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No wallet deposits found."
        />
      </div>

      {selectedRow ? (
        <WalletDepositDetailsModal
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

function toModalRow(row: CustomerDepositRow): WalletDepositModalRow {
  return {
    id: row.id,
    logId: row.transactionId,
    depositValue: row.depositValue,
    date: row.transactionDate,
    status: row.status,
    customerId: row.customerId,
  };
}
