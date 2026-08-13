"use client";

import { AssetTradeDetailsModal } from "@/module/dashboard/payments-settlements/components/modals/asset-trade-details-modal";
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
import { assetPurchaseHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "assetId",
  "partyName",
  "partyEmail",
  "representativeName",
];

function PurchaseDetailsModal(props: PaymentDetailModalProps) {
  return <AssetTradeDetailsModal variant="purchase" {...props} />;
}

export function AssetPurchaseHistoryTable() {
  return (
    <PaymentsHistoryTable
      sourceRows={assetPurchaseHistoryRows}
      searchFields={SEARCH_FIELDS}
      detailsModal={PurchaseDetailsModal}
      toolbarPlaceholder="Search Customer name or ID"
      buildColumns={(onView) => [
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
          onView,
        }),
      ]}
    />
  );
}
