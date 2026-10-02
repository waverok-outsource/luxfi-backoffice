"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { Copy } from "lucide-react";

import {
  ConfirmDialogContent,
  ModalDetailRow,
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  APPROVAL_STATUS_CONFIG,
  formatApprovalPayload,
} from "@/module/dashboard/approvals/data";
import { getApprovalRequestTarget, type ApprovalType } from "@/types/approval.type";

type ApprovalDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approval: ApprovalType;
  approvePending?: boolean;
  onApprove: (approval: ApprovalType, onSuccess: () => void) => void;
};

type ApprovalModalStep = "DETAIL" | "CONFIRM" | "SUCCESS";

function displayValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function ApprovalDetailStep({
  approval,
  onClose,
  onApprove,
}: {
  approval: ApprovalType;
  onClose: () => void;
  onApprove: () => void;
}) {
  const { copy } = useCopyToClipboard();
  const requestTarget = getApprovalRequestTarget(approval);
  const payloadText = formatApprovalPayload(approval.payload);
  const status = APPROVAL_STATUS_CONFIG[approval.status];
  const canApprove = approval.status === "pending";

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Approval details"
        description="Review the request before you approve it"
        showBackButton
        onBack={onClose}
      />

      <ModalShell.Body className="rounded-xl px-6 py-8">
        <div className="space-y-[14px]">
          <ModalDetailRow
            label="Approval ID"
            value={approval.approvalId}
            copyText={approval.approvalId}
          />
          <ModalDetailRow
            label="Method"
            value={
              <Badge variant="neutral" className="font-semibold">
                {approval.method || "-"}
              </Badge>
            }
          />
          <ModalDetailRow
            label="Path"
            value={
              <span className="max-w-[380px] text-right font-semibold break-all">
                {requestTarget || "-"}
              </span>
            }
            copyText={requestTarget || undefined}
          />
          <ModalDetailRow label="Description" value={displayValue(approval.description)} />
          <ModalDetailRow
            label="Status"
            value={
              <Badge variant={status.variant} showStatusDot>
                {status.label}
              </Badge>
            }
          />

          <div className="mx-auto h-px w-full max-w-[297px] bg-primary-grey-stroke/80" />

          <ModalDetailRow label="Maker" value={displayValue(approval.maker)} />
          <ModalDetailRow label="Checker" value={displayValue(approval.checker)} />
          <ModalDetailRow label="Unit" value={displayValue(approval.unit)} />

          <div className="mx-auto h-px w-full max-w-[297px] bg-primary-grey-stroke/80" />

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-medium text-text-grey">Payload</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl px-3 text-sm"
                disabled={!payloadText}
                onClick={() => void copy(payloadText, { successMessage: "Payload copied" })}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            {payloadText ? (
              <pre className="max-h-72 overflow-auto rounded-xl bg-primary-grey-undertone p-4 text-left text-sm leading-6 break-all whitespace-pre-wrap text-text-black">
                {payloadText}
              </pre>
            ) : (
              <p className="rounded-xl bg-primary-grey-undertone px-4 py-6 text-center text-sm text-text-grey">
                No payload was attached to this request.
              </p>
            )}
          </div>
        </div>
      </ModalShell.Body>

      <ModalShell.Footer className="pt-0" align="end">
        {canApprove ? (
          <ModalShell.Action
            type="button"
            variant="success"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={onApprove}
          >
            Approve
          </ModalShell.Action>
        ) : (
          <ModalShell.Action
            type="button"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={onClose}
          >
            Close
          </ModalShell.Action>
        )}
      </ModalShell.Footer>
    </div>
  );
}

export function ApprovalDetailsModal({
  open,
  onOpenChange,
  approval,
  approvePending = false,
  onApprove,
}: ApprovalDetailsModalProps) {
  const [step, setStep] = React.useState<ApprovalModalStep>("DETAIL");
  const requestTarget = getApprovalRequestTarget(approval);

  const stageConfig: Record<
    ApprovalModalStep,
    { contentClassName: string; content: ReactNode }
  > = {
    DETAIL: {
      contentClassName: "max-w-[760px] rounded-xl border-none p-4",
      content: (
        <ApprovalDetailStep
          approval={approval}
          onClose={() => onOpenChange(false)}
          onApprove={() => setStep("CONFIRM")}
        />
      ),
    },
    CONFIRM: {
      contentClassName:
        "w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Approve this request?"
          description={`This sends a ${approval.method || "request"} to ${requestTarget || "the stored path"} with the payload on this approval.`}
          confirmLabel="Yes, Approve"
          confirmVariant="success"
          pending={approvePending}
          onCancel={() => setStep("DETAIL")}
          onConfirm={() => onApprove(approval, () => setStep("SUCCESS"))}
        />
      ),
    },
    SUCCESS: {
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title="Request approved"
          description="The payload was sent with the method and path on this approval."
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const activeStage = stageConfig[step];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick={!approvePending}
      shellClassName={activeStage.contentClassName}
    >
      {activeStage.content}
    </ModalShell.Root>
  );
}
