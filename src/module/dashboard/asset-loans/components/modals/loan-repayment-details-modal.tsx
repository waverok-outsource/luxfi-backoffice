"use client";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { ASSET_LOANS_STATUS_CONFIG } from "@/module/dashboard/asset-loans/components/status-config";
import type { LoanRepaymentRow } from "@/module/dashboard/asset-loans/data";
import { formatCurrency } from "@/util/format-currency";

export function LoanRepaymentDetailsModal({
  open,
  onOpenChange,
  repayment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repayment: LoanRepaymentRow;
}) {
  const status = ASSET_LOANS_STATUS_CONFIG[repayment.status];

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
          title="Loan Repayment Details"
          description="View and manage transaction entry"
          showBackButton
          onBack={() => onOpenChange(false)}
        />

        <ModalShell.Body className="rounded-xl px-6 py-8">
          <div className="space-y-[14px]">
            <ModalDetailRow
              label="Log ID:"
              value={repayment.repaymentId}
              copyText={repayment.repaymentId}
            />
            <ModalDetailRow label="Date:" value={repayment.dateLabel} />
            <ModalDetailRow label="Timestamp:" value={repayment.timestampLabel} />
            <ModalDetailRow label="Payment Method:" value={repayment.paymentMethod} />
            <ModalDetailRow label="Payment Channel:" value={repayment.paymentChannel} />

            <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

            <ModalDetailRow label="Loan Value:" value={formatCurrency(repayment.loanValue)} />
            <ModalDetailRow
              label="Interest Accrued"
              value={formatCurrency(repayment.interestAccrued)}
            />
            <ModalDetailRow label="Repaid Value" value={formatCurrency(repayment.repaidValue)} />
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
              label="Borrower ID:"
              value={repayment.borrowerId}
              copyText={repayment.borrowerId}
            />
            <ModalDetailRow label="Borrower Name:" value={repayment.borrowerName} />
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
