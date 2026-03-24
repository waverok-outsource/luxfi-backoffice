"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

export function AssetSaleDetailsModal({
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
      title="Asset Sale Details"
      amountLabel="Sale Value:"
      partyIdLabel="Buyer ID:"
      partyNameLabel="Buyer Name:"
      partyEmailLabel="Buyer Email address:"
    />
  );
}
