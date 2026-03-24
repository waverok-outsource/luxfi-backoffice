"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";
import { formatCurrency } from "@/util/format-currency";

export function LoanDisbursementDetailsModal({
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
      title="Loan Disbursement Details"
      amountLabel="Loan Value:"
      amountValue={formatCurrency(payment.loanValue ?? payment.transactionValue)}
      partyIdLabel="Customer ID:"
      partyNameLabel="Customer Name:"
      partyEmailLabel="Customer Email address:"
    />
  );
}
