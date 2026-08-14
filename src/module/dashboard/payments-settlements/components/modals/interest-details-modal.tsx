"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";
import { formatCurrency } from "@/util/format-currency";

export function InterestDetailsModal({
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
      title="Interest Details"
      logId={payment.transactionId}
      dateLabel={payment.dateLabel}
      timestampLabel={payment.timestampLabel}
      amountLabel="Interest Value:"
      amountValue={formatCurrency(payment.transactionValue)}
      status={payment.status}
      partyIdLabel="Customer ID:"
      partyIdValue={payment.partyId}
      partyNameLabel="Customer Name:"
      partyNameValue={payment.partyName}
      partyEmailLabel="Customer Email address:"
      partyEmailValue={payment.partyEmail}
      showPaymentInfo={false}
      showApprover={false}
    />
  );
}
