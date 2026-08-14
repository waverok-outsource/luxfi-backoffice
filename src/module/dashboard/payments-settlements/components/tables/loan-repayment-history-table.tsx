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
import { useLoansRepayment } from "@/services/queries/payments.queries";
import type { LoanRepaymentItem } from "@/types/payments.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type LoanRepaymentRow = LoanRepaymentItem & { status: PaymentStatus };

export function LoanRepaymentHistoryTable() {
  const { value } = useURLQuery<{ page?: string; q?: string; from?: string; to?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedRow, setSelectedRow] = useState<LoanRepaymentRow | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: response, isLoading } = useLoansRepayment(query);
  const rows: LoanRepaymentRow[] = (response?.data ?? []).map((item) => ({
    ...item,
    status: normalizePaymentStatus(item.status),
  }));

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const columns: ColumnDef<LoanRepaymentRow, unknown>[] = [
    createSerialColumn<LoanRepaymentRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<LoanRepaymentRow>("Transaction ID", "transactionId"),
    createIdentifierColumn<LoanRepaymentRow>("Loan ID", "loanId"),
    {
      accessorKey: "loanValue",
      header: "Loan Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "repaidValue",
      header: "Repaid Value",
      cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
    },
    {
      id: "date",
      header: "Transaction Date",
      cell: ({ row }) => <span>{formatDate(row.original.transactionDate, "dd/MM/yyyy")}</span>,
    },
    createStatusColumn<LoanRepaymentRow, PaymentStatus>("Status ID", PAYMENTS_STATUS_CONFIG),
    createActionColumnWithOptions<LoanRepaymentRow>({
      ariaLabel: "View loan repayment details",
      onView: setSelectedRow,
    }),
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Loan ID or Customer ID" />
        <BaseTable<LoanRepaymentRow>
          data={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? rows.length}
          pageSize={(response?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No loan repayments found."
        />
      </div>

      {selectedRow ? (
        <LoanDetailsModal
          variant="repayment"
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

function toModalRow(row: LoanRepaymentRow): LoanModalRow {
  return {
    id: row.id,
    logId: row.transactionId,
    loanValue: row.loanValue,
    date: row.transactionDate,
    status: row.status,
  };
}
