"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { LoanRepaymentDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/loan-repayment-details-modal";
import {
  createActionColumnWithOptions,
  createAmountColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  PaymentsBaseTable,
  PaymentsTableToolbar,
  useFilteredPaymentRows,
} from "@/module/dashboard/payments-settlements/components/tables/shared";
import { loanRepaymentHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "loanId",
  "partyName",
  "partyEmail",
];

export function LoanRepaymentHistoryTable() {
  const { value } = useURLQuery<{ q?: string }>();
  const search = value.q ?? "";
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredPaymentRows(loanRepaymentHistoryRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<PaymentSettlementRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Transaction ID", "transactionId"),
      createIdentifierColumn("Loan ID", "loanId"),
      createAmountColumn("Loan Value", "loanValue"),
      createAmountColumn("Repaid Value", "repaidValue"),
      createTextColumn("Transaction Date", "date"),
      createStatusColumn("Status ID"),
      createActionColumnWithOptions({
        ariaLabel: "View loan repayment details",
        onView: (row) => setSelectedPayment(row),
      }),
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <PaymentsTableToolbar />
        <PaymentsBaseTable rows={rows} columns={columns} pageSize={10} totalEntries={rows.length} />
      </div>

      {selectedPayment ? (
        <LoanRepaymentDetailsModal
          open={Boolean(selectedPayment)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPayment(null);
            }
          }}
          payment={selectedPayment}
        />
      ) : null}
    </>
  );
}
