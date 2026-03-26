"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { AssetPurchaseDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/asset-purchase-details-modal";
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
import { assetPurchaseHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "assetId",
  "partyName",
  "partyEmail",
  "representativeName",
];

export function AssetPurchaseHistoryTable() {
  const { search } = useURLTableSearch();
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredPaymentRows(assetPurchaseHistoryRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<PaymentSettlementRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Transaction ID", "transactionId"),
      createIdentifierColumn("Asset ID", "assetId"),
      createAmountColumn("Transaction Value", "transactionValue"),
      createTextColumn("Seller", "partyName"),
      createTextColumn("Pawn Representative", "representativeName"),
      createTextColumn("Date", "date"),
      createStatusColumn("Payment Status"),
      createActionColumnWithOptions({
        ariaLabel: "View asset purchase details",
        onView: (row) => setSelectedPayment(row),
      }),
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <PaymentsTableToolbar
          placeholder="Search Customer name or ID"
        />
        <PaymentsBaseTable rows={rows} columns={columns} pageSize={10} totalEntries={rows.length} />
      </div>

      {selectedPayment ? (
        <AssetPurchaseDetailsModal
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
