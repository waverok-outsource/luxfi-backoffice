"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { LoanDisbursementDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/loan-disbursement-details-modal";
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
import { loanDisbursementHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "loanId",
  "partyName",
  "partyEmail",
];

export function LoanDisbursementHistoryTable() {
  const { search } = useURLTableSearch();
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredPaymentRows(loanDisbursementHistoryRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<PaymentSettlementRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Transaction ID", "transactionId"),
      createIdentifierColumn("Loan ID", "loanId"),
      createAmountColumn("Loan Value", "loanValue"),
      createAmountColumn("Disbursed Value", "disbursedValue"),
      createTextColumn("Transaction Date", "date"),
      createStatusColumn("Status ID"),
      createActionColumnWithOptions({
        ariaLabel: "View loan disbursement details",
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
        <LoanDisbursementDetailsModal
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
