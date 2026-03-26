"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { InterestDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/interest-details-modal";

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
import {
  interestSettlementRows,
  type PaymentSettlementRow,
} from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "loanId",
  "partyName",
  "partyEmail",
];

export function InterestSettlementsTable() {
  const { search } = useURLTableSearch();
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredPaymentRows(interestSettlementRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<PaymentSettlementRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Transaction ID", "transactionId"),
      createIdentifierColumn("Loan ID", "loanId"),
      createAmountColumn("Interest Value", "transactionValue"),
      createTextColumn("Currency", "paymentMethod"),
      createTextColumn("Transaction Date", "date"),
      createStatusColumn("Status ID"),
      createActionColumnWithOptions({
        ariaLabel: "View interest settlement details",
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
        <InterestDetailsModal
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
