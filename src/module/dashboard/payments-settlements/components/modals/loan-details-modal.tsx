"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useLoanDisbursementDetails, useLoansRepaymentDetails } from "@/services/queries/payments.queries";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";

const LOADING_PLACEHOLDER = "Loading...";

export type LoanModalRow = {
  id: string;
  logId: string;
  loanValue: number;
  date: string;
  status: PaymentStatus;
};

type LoanDetailsModalProps = {
  variant: "disbursement" | "repayment";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: LoanModalRow;
};

const LOAN_DETAILS_CONFIG = {
  disbursement: { title: "Loan Disbursement Details" },
  repayment: { title: "Loan Repayment Details" },
} satisfies Record<LoanDetailsModalProps["variant"], { title: string }>;

export function LoanDetailsModal({ variant, open, onOpenChange, row }: LoanDetailsModalProps) {
  const { data: disbursement, isLoading: isDisbursementLoading } = useLoanDisbursementDetails(
    row.id,
    open && variant === "disbursement",
  );
  const { data: repayment, isLoading: isRepaymentLoading } = useLoansRepaymentDetails(
    row.id,
    open && variant === "repayment",
  );

  const isLoadingDetails = variant === "disbursement" ? isDisbursementLoading : isRepaymentLoading;
  const customer = variant === "disbursement" ? disbursement?.customer : repayment?.customer;
  const approver = variant === "disbursement" ? disbursement?.approver : repayment?.approver;
  const paymentMethod = variant === "disbursement" ? disbursement?.paymentMethod : repayment?.paymentMethod;
  const paymentChannel =
    variant === "disbursement" ? disbursement?.paymentChannel : repayment?.paymentChannel;

  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={LOAN_DETAILS_CONFIG[variant].title}
      logId={row.logId}
      dateLabel={formatDate(row.date, "do MMMM, yyyy")}
      timestampLabel={formatDate(row.date, "hh:mm a")}
      paymentMethod={paymentMethod}
      paymentChannel={paymentChannel}
      amountLabel="Loan Value:"
      amountValue={formatCurrency(row.loanValue)}
      status={row.status}
      partyIdLabel="Customer ID:"
      partyIdValue={customer?.id ?? (isLoadingDetails ? LOADING_PLACEHOLDER : "-")}
      partyNameLabel="Customer Name:"
      partyNameValue={customer?.name ?? (isLoadingDetails ? LOADING_PLACEHOLDER : "-")}
      partyEmailLabel="Customer Email address:"
      partyEmailValue={customer?.email}
      approverId={approver?.id}
      approverRole={approver?.role}
      isLoadingDetails={isLoadingDetails}
    />
  );
}
