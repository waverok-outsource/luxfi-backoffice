"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useAssetPurchaseDetails, useAssetSaleDetails } from "@/services/queries/payments.queries";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";

export type AssetTradeModalRow = {
  id: string;
  logId: string;
  transactionValue: number;
  date: string;
  status: PaymentStatus;
  partyId: string;
  partyName: string;
  representativeName?: string;
};

type AssetTradeDetailsModalProps = {
  variant: "purchase" | "sale";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: AssetTradeModalRow;
};

const ASSET_TRADE_CONFIG = {
  purchase: {
    title: "Asset Purchase Details",
    partyIdLabel: "Seller ID:",
    partyNameLabel: "Seller Name:",
    partyEmailLabel: "Seller Email address:",
    representativeLabel: "Pawn Representative:",
  },
  sale: {
    title: "Asset Sale Details",
    partyIdLabel: "Buyer ID:",
    partyNameLabel: "Buyer Name:",
    partyEmailLabel: "Buyer Email address:",
    representativeLabel: undefined,
  },
} satisfies Record<
  AssetTradeDetailsModalProps["variant"],
  {
    title: string;
    partyIdLabel: string;
    partyNameLabel: string;
    partyEmailLabel: string;
    representativeLabel?: string;
  }
>;

export function AssetTradeDetailsModal({
  variant,
  open,
  onOpenChange,
  row,
}: AssetTradeDetailsModalProps) {
  const config = ASSET_TRADE_CONFIG[variant];

  const { data: saleDetails, isLoading: isSaleLoading } = useAssetSaleDetails(
    row.id,
    open && variant === "sale",
  );
  const { data: purchaseDetails, isLoading: isPurchaseLoading } = useAssetPurchaseDetails(
    row.id,
    open && variant === "purchase",
  );

  const isLoadingDetails = variant === "sale" ? isSaleLoading : isPurchaseLoading;
  const party = variant === "sale" ? saleDetails?.buyer : purchaseDetails?.seller;
  const approver = variant === "sale" ? saleDetails?.approver : purchaseDetails?.approver;
  const paymentMethod = variant === "sale" ? saleDetails?.paymentMethod : purchaseDetails?.paymentMethod;
  const paymentChannel =
    variant === "sale" ? saleDetails?.paymentChannel : purchaseDetails?.paymentChannel;

  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      logId={row.logId}
      dateLabel={formatDate(row.date, "do MMMM, yyyy")}
      timestampLabel={formatDate(row.date, "hh:mm a")}
      paymentMethod={paymentMethod}
      paymentChannel={paymentChannel}
      amountLabel="Sale Value:"
      amountValue={formatCurrency(row.transactionValue)}
      status={row.status}
      partyIdLabel={config.partyIdLabel}
      partyIdValue={row.partyId}
      partyNameLabel={config.partyNameLabel}
      partyNameValue={row.partyName}
      partyEmailLabel={config.partyEmailLabel}
      partyEmailValue={party?.email}
      representativeLabel={config.representativeLabel}
      representativeValue={row.representativeName}
      approverId={approver?.id}
      approverRole={approver?.role}
      isLoadingDetails={isLoadingDetails}
    />
  );
}
