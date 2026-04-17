"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { WalletDepositDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/wallet-deposit-details-modal";
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
  const { value } = useURLQuery<{ q?: string }>();
  const search = value.q ?? "";
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredPaymentRows(customerWalletDepositRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<PaymentSettlementRow, unknown>[]>(
    () => [
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
        <WalletDepositDetailsModal
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
