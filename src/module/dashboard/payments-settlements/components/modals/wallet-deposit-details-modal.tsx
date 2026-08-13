"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

export function WalletDepositDetailsModal({
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
      title="Wallet Deposit Details"
      amountLabel="Deposit Value:"
      partyIdLabel="Customer ID:"
      partyNameLabel="Customer Name:"
      partyEmailLabel="Customer Email address:"
    />
  );
}
