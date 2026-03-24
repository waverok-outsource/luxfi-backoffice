"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

export function AssetPurchaseDetailsModal({
  open,
  onOpenChange,
  payment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
}) {
  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      payment={payment}
      title="Asset Purchase Details"
      amountLabel="Sale Value:"
      partyIdLabel="Seller ID:"
      partyNameLabel="Seller Name:"
      partyEmailLabel="Seller Email address:"
      representativeLabel="Pawn Representative:"
    />
  );
}
