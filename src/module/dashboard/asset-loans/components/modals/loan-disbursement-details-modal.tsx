"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { ASSET_LOANS_STATUS_CONFIG } from "@/module/dashboard/asset-loans/components/status-config";
import type { LoanDisbursementRow } from "@/module/dashboard/asset-loans/data";
import { formatCurrency } from "@/util/format-currency";

export function LoanDisbursementDetailsModal({
  open,
  onOpenChange,
  disbursement,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disbursement: LoanDisbursementRow;
}) {
  const status = ASSET_LOANS_STATUS_CONFIG[disbursement.status];

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
          title="Loan Disbursement Details"
          description="View and manage transaction entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow
              label="Log ID:"
              value={disbursement.disbursementId}
              copyText={disbursement.disbursementId}
            />
            <ModalDetailRow label="Disbursed Date:" value={disbursement.dateLabel} />
            <ModalDetailRow label="Timestamp:" value={disbursement.timestampLabel} />
            <ModalDetailRow label="Payment Method:" value={disbursement.paymentMethod} />
            <ModalDetailRow label="Payment Channel:" value={disbursement.paymentChannel} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Loan Value:" value={formatCurrency(disbursement.loanValue)} />
            <ModalDetailRow
              label="Disbursed Value"
              value={formatCurrency(disbursement.disbursedValue)}
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
              label="Initiator ID:"
              value={disbursement.borrowerId}
              copyText={disbursement.borrowerId}
            />
            <ModalDetailRow label="Initiator Name:" value={disbursement.borrowerName} />
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
