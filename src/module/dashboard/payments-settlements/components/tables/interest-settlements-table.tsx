"use client";

import { InterestDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/interest-details-modal";
import {
  createActionColumnWithOptions,
  createAmountColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  PaymentsHistoryTable,
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
  return (
    <PaymentsHistoryTable
      sourceRows={interestSettlementRows}
      searchFields={SEARCH_FIELDS}
      detailsModal={InterestDetailsModal}
      buildColumns={(onView) => [
        createSerialColumn(),
        createIdentifierColumn("Transaction ID", "transactionId"),
        createIdentifierColumn("Loan ID", "loanId"),
        createAmountColumn("Interest Value", "transactionValue"),
        createTextColumn("Currency", "paymentMethod"),
        createTextColumn("Transaction Date", "date"),
        createStatusColumn("Status ID"),
        createActionColumnWithOptions({
          ariaLabel: "View interest settlement details",
          onView,
        }),
      ]}
    />
  );
}
