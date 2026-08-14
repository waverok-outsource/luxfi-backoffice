"use client";

import { PaymentDetailModalLayout } from "@/module/dashboard/payments-settlements/components/modals/shared";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";
import { useCustomerDepositDetails } from "@/services/queries/payments.queries";
import { formatCurrency } from "@/util/format-currency";
import { formatDate } from "@/util/helper";

export type WalletDepositModalRow = {
  id: string;
  logId: string;
  depositValue: number;
  date: string;
  status: PaymentStatus;
  customerId: string;
};

export function WalletDepositDetailsModal({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: WalletDepositModalRow;
}) {
  const { data, isLoading } = useCustomerDepositDetails(row.id, open);

  return (
    <PaymentDetailModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Wallet Deposit Details"
      logId={row.logId}
      dateLabel={formatDate(row.date, "do MMMM, yyyy")}
      timestampLabel={formatDate(row.date, "hh:mm a")}
      paymentMethod={data?.paymentMethod}
      paymentChannel={data?.paymentChannel}
      amountLabel="Deposit Value:"
      amountValue={formatCurrency(row.depositValue)}
      status={row.status}
      partyIdLabel="Customer ID:"
      partyIdValue={row.customerId}
      partyNameLabel="Customer Name:"
      partyNameValue={data?.customer.name ?? (isLoading ? "Loading..." : "-")}
      partyEmailLabel="Customer Email address:"
      partyEmailValue={data?.customer.email}
      approverId={data?.approver.id}
      approverRole={data?.approver.role}
      isLoadingDetails={isLoading}
    />
  );
}
