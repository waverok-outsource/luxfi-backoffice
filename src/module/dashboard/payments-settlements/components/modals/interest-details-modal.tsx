"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusConfig } from "@/module/dashboard/payments-settlements/components/status-config";
import type { PaymentSettlementRow } from "@/module/dashboard/payments-settlements/data";
import { formatCurrency } from "@/util/format-currency";

type InterestDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
};

export function InterestDetailsModal({ open, onOpenChange, payment }: InterestDetailsModalProps) {
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
          title="Interest Details"
          description="View and manage transaction entry"
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

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow
              label="Interest Value:"
              value={formatCurrency(payment.transactionValue)}
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
              label="Customer ID:"
              value={payment.partyId}
              copyText={payment.partyId}
            />
            <ModalDetailRow label="Customer Name:" value={payment.partyName} />
            <ModalDetailRow
              label="Customer Email address:"
              value={payment.partyEmail}
              copyText={payment.partyEmail}
            />
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
