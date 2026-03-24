"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/util/format-currency";
import { getPaymentStatusConfig } from "@/module/dashboard/payments-settlements/components/status-config";

import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";

type PaymentDetailModalLayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
  title: string;
  description?: string;
  amountLabel: string;
  amountValue?: string;
  partyIdLabel: string;
  partyNameLabel: string;
  partyEmailLabel: string;
  representativeLabel?: string;
};

export function PaymentDetailModalLayout({
  open,
  onOpenChange,
  payment,
  title,
  description = "View and manage transaction entry",
  amountLabel,
  amountValue,
  partyIdLabel,
  partyNameLabel,
  partyEmailLabel,
  representativeLabel,
}: PaymentDetailModalLayoutProps) {
  const status = getPaymentStatusConfig(payment.status);

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[646px] rounded-xl border-none p-4"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title={title}
          description={description}
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow
              label="Log ID:"
              value={payment.transactionId}
              copyText={payment.transactionId}
            />
            <ModalDetailRow label="Transaction Date:" value={payment.dateLabel} />
            <ModalDetailRow label="Timestamp:" value={payment.timestampLabel} />
            <ModalDetailRow label="Payment Method:" value={payment.paymentMethod} />
            <ModalDetailRow label="Payment Channel:" value={payment.paymentChannel} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow
              label={amountLabel}
              value={amountValue ?? formatCurrency(payment.transactionValue)}
            />
            <ModalDetailRow
              label="Status ID:"
              value={
                <Badge variant={status.variant} showStatusDot>
                  {status.label}
                </Badge>
              }
            />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow
              label={partyIdLabel}
              value={payment.partyId}
              copyText={payment.partyId}
            />
            <ModalDetailRow label={partyNameLabel} value={payment.partyName} />
            <ModalDetailRow
              label={partyEmailLabel}
              value={payment.partyEmail}
              copyText={payment.partyEmail}
            />

            {representativeLabel && payment.representativeName ? (
              <ModalDetailRow label={representativeLabel} value={payment.representativeName} />
            ) : null}

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Approver ID:" value={payment.approverId} />
            <ModalDetailRow label="Approver Role:" value={payment.approverRole} />
          </div>
        </ModalShell.Body>

        <ModalShell.Footer className="pt-0" align="end">
          <ModalShell.Action
            type="button"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Close
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
