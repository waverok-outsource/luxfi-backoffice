"use client";

import { LoanDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/loan-details-modal";
import {
  createActionColumnWithOptions,
  createAmountColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  PaymentsHistoryTable,
  type PaymentDetailModalProps,
} from "@/module/dashboard/payments-settlements/components/tables/shared";
import { loanRepaymentHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "loanId",
  "partyName",
  "partyEmail",
];

function RepaymentDetailsModal(props: PaymentDetailModalProps) {
  return <LoanDetailsModal variant="repayment" {...props} />;
}

export function LoanRepaymentHistoryTable() {
  return (
    <PaymentsHistoryTable
      sourceRows={loanRepaymentHistoryRows}
      searchFields={SEARCH_FIELDS}
      detailsModal={RepaymentDetailsModal}
      buildColumns={(onView) => [
        createSerialColumn(),
        createIdentifierColumn("Transaction ID", "transactionId"),
        createIdentifierColumn("Loan ID", "loanId"),
        createAmountColumn("Loan Value", "loanValue"),
        createAmountColumn("Repaid Value", "repaidValue"),
        createTextColumn("Transaction Date", "date"),
        createStatusColumn("Status ID"),
        createActionColumnWithOptions({
          ariaLabel: "View loan repayment details",
          onView,
        }),
      ]}
    />
  );
}
