"use client";

import { WalletDepositDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/wallet-deposit-details-modal";
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
  customerWalletDepositRows,
  type PaymentSettlementRow,
} from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "partyId",
  "assetId",
  "partyName",
];

export function CustomerWalletDepositsTable() {
  return (
    <PaymentsHistoryTable
      sourceRows={customerWalletDepositRows}
      searchFields={SEARCH_FIELDS}
      detailsModal={WalletDepositDetailsModal}
      buildColumns={(onView) => [
        createSerialColumn(),
        createIdentifierColumn("Transaction ID", "transactionId"),
        createIdentifierColumn("Customer ID", "partyId"),
        createAmountColumn("Deposit Value", "transactionValue"),
        createIdentifierColumn("Wallet ID", "assetId"),
        createTextColumn("Currency", "paymentMethod"),
        createTextColumn("Transaction Date", "date"),
        createStatusColumn("Status ID"),
        createActionColumnWithOptions({
          ariaLabel: "View wallet deposit details",
          onView,
        }),
      ]}
    />
  );
}
