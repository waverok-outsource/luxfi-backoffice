"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";
import { formatCurrency } from "@/util/format-currency";

type LoanDetailsModalProps = {
  variant: "disbursement" | "repayment";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
};

const LOAN_DETAILS_CONFIG = {
  disbursement: { title: "Loan Disbursement Details" },
  repayment: { title: "Loan Repayment Details" },
} satisfies Record<LoanDetailsModalProps["variant"], { title: string }>;

export function LoanDetailsModal({
  variant,
  open,
  onOpenChange,
  payment,
}: LoanDetailsModalProps) {
  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      payment={payment}
      title={LOAN_DETAILS_CONFIG[variant].title}
      amountLabel="Loan Value:"
      amountValue={formatCurrency(payment.loanValue ?? payment.transactionValue)}
      partyIdLabel="Customer ID:"
      partyNameLabel="Customer Name:"
      partyEmailLabel="Customer Email address:"
    />
  );
}
