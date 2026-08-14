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
} from "@/components/table";
import {
  LoanDetailsModal,
  type LoanModalRow,
} from "@/module/dashboard/payments-settlements/components/modals/loan-details-modal";
import {
  PAYMENTS_STATUS_CONFIG,
  normalizePaymentStatus,
} from "@/module/dashboard/payments-settlements/components/status-config";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useLoanDisbursements } from "@/services/queries/payments.queries";
import type { LoanDisbursementItem } from "@/types/payments.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type LoanDisbursementRow = LoanDisbursementItem & { status: PaymentStatus };

export function LoanDisbursementHistoryTable() {
  const { value } = useURLQuery<{ page?: string; q?: string; from?: string; to?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedRow, setSelectedRow] = useState<LoanDisbursementRow | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: response, isLoading } = useLoanDisbursements(query);
  const rows: LoanDisbursementRow[] = (response?.data ?? []).map((item) => ({
    ...item,
    status: normalizePaymentStatus(item.status),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const columns: ColumnDef<LoanDisbursementRow, unknown>[] = [
    createSerialColumn<LoanDisbursementRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<LoanDisbursementRow>("Transaction ID", "transactionId"),
    createIdentifierColumn<LoanDisbursementRow>("Loan ID", "loanId"),
    {
      accessorKey: "loanValue",
      header: "Loan Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "disbursedValue",
      header: "Disbursed Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    {
      id: "date",
      header: "Transaction Date",
      cell: ({ row }) => <span>{formatDate(row.original.transactionDate, "dd/MM/yyyy")}</span>,
    },
    createStatusColumn<LoanDisbursementRow, PaymentStatus>("Status ID", PAYMENTS_STATUS_CONFIG),
    createActionColumnWithOptions<LoanDisbursementRow>({
      ariaLabel: "View loan disbursement details",
      onView: setSelectedRow,
    }),
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Loan ID or Customer ID" />
        <BaseTable<LoanDisbursementRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? rows.length}
          pageSize={(response?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No loan disbursements found."
        />
      </div>

      {selectedRow ? (
        <LoanDetailsModal
          variant="disbursement"
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

function toModalRow(row: LoanDisbursementRow): LoanModalRow {
  return {
    id: row.id,
    logId: row.transactionId,
    loanValue: row.loanValue,
    date: row.transactionDate,
    status: row.status,
  };
}
