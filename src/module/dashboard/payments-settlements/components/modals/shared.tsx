"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusConfig } from "@/module/dashboard/payments-settlements/components/status-config";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";

const LOADING_PLACEHOLDER = "Loading...";

type PaymentDetailModalLayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  logId: string;
  dateLabel: string;
  timestampLabel: string;
  paymentMethod?: string | null;
  paymentChannel?: string | null;
  amountLabel: string;
  amountValue: string;
  status: PaymentStatus;
  partyIdLabel: string;
  partyIdValue: string;
  partyNameLabel: string;
  partyNameValue: string;
  partyEmailLabel: string;
  partyEmailValue?: string | null;
  representativeLabel?: string;
  representativeValue?: string;
  approverId?: string | null;
  approverRole?: string | null;
  /** Renders the Payment Method / Payment Channel rows. Defaults to true. */
  showPaymentInfo?: boolean;
  /** Renders the Approver ID / Approver Role rows. Defaults to true. */
  showApprover?: boolean;
  /** True while fields only available from the details endpoint are still loading. */
  isLoadingDetails?: boolean;
};

export function PaymentDetailModalLayout({
  open,
  onOpenChange,
  title,
  description = "View and manage transaction entry",
  logId,
  dateLabel,
  timestampLabel,
  paymentMethod,
  paymentChannel,
  amountLabel,
  amountValue,
  status,
  partyIdLabel,
  partyIdValue,
  partyNameLabel,
  partyNameValue,
  partyEmailLabel,
  partyEmailValue,
  representativeLabel,
  representativeValue,
  approverId,
  approverRole,
  showPaymentInfo = true,
  showApprover = true,
  isLoadingDetails = false,
}: PaymentDetailModalLayoutProps) {
  const statusConfig = getPaymentStatusConfig(status);
  const loadingValue = (value: string | null | undefined) =>
    isLoadingDetails ? LOADING_PLACEHOLDER : (value ?? "-");

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
            <ModalDetailRow label="Log ID:" value={logId} copyText={logId} />
            <ModalDetailRow label="Transaction Date:" value={dateLabel} />
            <ModalDetailRow label="Timestamp:" value={timestampLabel} />
            {showPaymentInfo ? (
              <>
                <ModalDetailRow label="Payment Method:" value={loadingValue(paymentMethod)} />
                <ModalDetailRow label="Payment Channel:" value={loadingValue(paymentChannel)} />
              </>
            ) : null}

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label={amountLabel} value={amountValue} />
            <ModalDetailRow
              label="Status ID:"
              value={
                <Badge variant={statusConfig.variant} showStatusDot>
                  {statusConfig.label}
                </Badge>
              }
            />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label={partyIdLabel} value={partyIdValue} copyText={partyIdValue} />
            <ModalDetailRow label={partyNameLabel} value={partyNameValue} />
            <ModalDetailRow
              label={partyEmailLabel}
              value={loadingValue(partyEmailValue)}
              copyText={partyEmailValue ?? undefined}
            />

            {representativeLabel && representativeValue ? (
              <ModalDetailRow label={representativeLabel} value={representativeValue} />
            ) : null}

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            {showApprover ? (
              <>
                <ModalDetailRow label="Approver ID:" value={loadingValue(approverId)} />
                <ModalDetailRow label="Approver Role:" value={loadingValue(approverRole)} />
              </>
            ) : null}
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
