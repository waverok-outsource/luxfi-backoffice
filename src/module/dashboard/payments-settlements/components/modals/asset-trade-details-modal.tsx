"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

type AssetTradeDetailsModalProps = {
  variant: "purchase" | "sale";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
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
  payment,
}: AssetTradeDetailsModalProps) {
  const config = ASSET_TRADE_CONFIG[variant];

  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      payment={payment}
      title={config.title}
      amountLabel="Sale Value:"
      partyIdLabel={config.partyIdLabel}
      partyNameLabel={config.partyNameLabel}
      partyEmailLabel={config.partyEmailLabel}
      representativeLabel={config.representativeLabel}
    />
  );
}
