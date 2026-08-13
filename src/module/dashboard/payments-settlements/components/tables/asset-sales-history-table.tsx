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
import { assetSalesHistoryRows, type PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

const SEARCH_FIELDS: Array<keyof PaymentSettlementRow> = [
  "transactionId",
  "assetId",
  "asset",
  "partyName",
  "partyEmail",
];

function SaleDetailsModal(props: PaymentDetailModalProps) {
  return <AssetTradeDetailsModal variant="sale" {...props} />;
}

export function AssetSalesHistoryTable() {
  return (
    <PaymentsHistoryTable
      sourceRows={assetSalesHistoryRows}
      searchFields={SEARCH_FIELDS}
      detailsModal={SaleDetailsModal}
      toolbarPlaceholder="Search Customer name or ID"
      buildColumns={(onView) => [
        createSerialColumn(),
        createIdentifierColumn("Transaction ID", "transactionId"),
        createIdentifierColumn("Asset ID", "assetId"),
        createTextColumn("Asset", "asset"),
        createAmountColumn("Transaction Value", "transactionValue"),
        createTextColumn("Buyer", "partyName"),
        createTextColumn("Date", "date"),
        createStatusColumn("Payment Status"),
        createActionColumnWithOptions({
          ariaLabel: "View asset sale details",
          onView,
        }),
      ]}
    />
  );
}
