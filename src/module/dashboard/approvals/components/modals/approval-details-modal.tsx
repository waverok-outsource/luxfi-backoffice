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
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  APPROVAL_STATUS_CONFIG,
  approvalActionLabel,
  formatApprovalPayload,
} from "@/module/dashboard/approvals/data";
import { useApproval } from "@/services/queries/approval.queries";
import type { ApprovalListScope, ApprovalType } from "@/types/approval.type";
import { formatDate } from "@/util/helper";
import Storage from "@/util/storage";

type ApprovalDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approval: ApprovalType;
  scope: ApprovalListScope;
  approvePending?: boolean;
  rejectPending?: boolean;
  cancelPending?: boolean;
  actionPending?: boolean;
  onApprove: (approvalId: string, onSuccess: () => void) => void;
  onReject: (approvalId: string, reason: string, onSuccess: () => void) => void;
  onCancel: (approvalId: string, reason: string, onSuccess: () => void) => void;
};

type ApprovalModalStep = "DETAIL" | "CONFIRM_APPROVE" | "REASON" | "SUCCESS";
type ReasonAction = "reject" | "cancel";
type CompletedAction = "approve" | ReasonAction;

function displayValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function formatWhen(value?: string) {
  return value ? formatDate(value, "dd MMM yyyy, h:mm a") : "-";
}

function actorFor(approval: ApprovalType, currentUserId: string, scope: ApprovalListScope) {
  if (scope === "mine") {
    return "maker" as const;
  }

  if (!currentUserId || !approval.makerId) {
    return "unknown" as const;
  }

  return approval.makerId === currentUserId ? ("maker" as const) : ("checker" as const);
}

function ApprovalDetailStep({
  approval,
  detailLoading,
  detailError,
  actor,
  onClose,
  onApprove,
  onReject,
  onCancel,
}: {
  approval: ApprovalType;
  detailLoading: boolean;
  detailError: boolean;
  actor: "maker" | "checker" | "unknown";
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}) {
  const { copy } = useCopyToClipboard();
  const payloadText = formatApprovalPayload(approval.replay?.body);
  const status = APPROVAL_STATUS_CONFIG[approval.status];
  const canReview = approval.status === "pending" && actor === "checker";
  const canCancel = approval.status === "pending" && actor === "maker";

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Approval details"
        description="Review who asked for this and what happens next"
        showBackButton
        onBack={onClose}
      />

      <ModalShell.Body className="rounded-xl px-6 py-8">
        <div className="space-y-[14px]">
          <ModalDetailRow label="Description" value={displayValue(approval.description)} />
          <ModalDetailRow
            label="Status"
            value={
              <Badge variant={status.variant} showStatusDot>
                {status.label}
              </Badge>
            }
          />
          <ModalDetailRow label="Made by" value={displayValue(approval.maker)} />
          <ModalDetailRow label="Made on" value={formatWhen(approval.createdAt)} />
          {approval.checker ? <ModalDetailRow label="Checked by" value={approval.checker} /> : null}
          {approval.checkedAt ? (
            <ModalDetailRow label="Checked on" value={formatWhen(approval.checkedAt)} />
          ) : null}
          {approval.status === "pending" || approval.status === "processing" ? (
            <ModalDetailRow label="Expires" value={formatWhen(approval.expiresAt)} />
          ) : null}
          {approval.rejectionReason ? (
            <ModalDetailRow label="Rejection reason" value={approval.rejectionReason} />
          ) : null}
          {approval.executionError ? (
            <ModalDetailRow label="Failure" value={approval.executionError} />
          ) : null}

          <div className="mx-auto h-px w-full max-w-[297px] bg-primary-grey-stroke/80" />

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-medium text-text-grey">Request details</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl px-3 text-sm"
                disabled={!payloadText}
                onClick={() => void copy(payloadText, { successMessage: "Request details copied" })}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            {detailLoading ? (
              <p className="rounded-xl bg-primary-grey-undertone px-4 py-6 text-center text-sm text-text-grey">
                Loading request details…
              </p>
            ) : detailError ? (
              <p className="rounded-xl bg-primary-grey-undertone px-4 py-6 text-center text-sm text-text-red">
                Request details could not be loaded.
              </p>
            ) : payloadText ? (
              <pre className="max-h-72 overflow-auto rounded-xl bg-primary-grey-undertone p-4 text-left text-sm leading-6 break-all whitespace-pre-wrap text-text-black">
                {payloadText}
              </pre>
            ) : (
              <p className="rounded-xl bg-primary-grey-undertone px-4 py-6 text-center text-sm text-text-grey">
                No request details were attached.
              </p>
            )}
          </div>

          {approval.history.length > 0 ? (
            <div className="space-y-3 pt-2">
              <p className="text-base font-medium text-text-grey">History</p>
              <ul className="max-h-64 space-y-3 overflow-auto">
                {approval.history.map((event, index) => (
                  <li
                    key={`${event.action}-${event.at}-${index}`}
                    className="rounded-xl bg-primary-grey-undertone px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-text-black">
                        {approvalActionLabel(event.action)}
                      </p>
                      <p className="shrink-0 text-xs text-text-grey">{formatWhen(event.at)}</p>
                    </div>
                    {event.actorName ? (
                      <p className="mt-1 text-sm text-text-grey">{event.actorName}</p>
                    ) : null}
                    {event.note ? <p className="mt-1 text-sm text-text-black">{event.note}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </ModalShell.Body>

      <ModalShell.Footer className="pt-0" align="end">
        {canReview ? (
          <>
            <ModalShell.Action
              type="button"
              variant="danger"
              className="h-12 rounded-[14px] text-base font-semibold"
              onClick={onReject}
            >
              Reject
            </ModalShell.Action>
            <ModalShell.Action
              type="button"
              variant="success"
              className="h-12 rounded-[14px] text-base font-semibold"
              disabled={detailLoading || detailError}
              onClick={onApprove}
            >
              Approve
            </ModalShell.Action>
          </>
        ) : null}
        {canCancel ? (
          <ModalShell.Action
            type="button"
            variant="danger"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={onCancel}
          >
            Cancel request
          </ModalShell.Action>
        ) : null}
        {!canReview && !canCancel ? (
          <ModalShell.Action
            type="button"
            className="h-12 rounded-[14px] text-base font-semibold"
            onClick={onClose}
          >
            Close
          </ModalShell.Action>
        ) : null}
      </ModalShell.Footer>
    </div>
  );
}

function ReasonStep({
  action,
  pending,
  onBack,
  onConfirm,
}: {
  action: ReasonAction;
  pending: boolean;
  onBack: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState("");
  const isReject = action === "reject";

  const submit = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 3) {
      setReasonError("Enter a reason of at least 3 characters.");
      return;
    }
    if (trimmed.length > 500) {
      setReasonError("Use 500 characters or fewer.");
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ModalShell.Header
        title={isReject ? "Reject this request?" : "Cancel this request?"}
        description={
          isReject
            ? "The maker will see this reason on the approval."
            : "This withdraws the request before anyone reviews it."
        }
        showBackButton={!pending}
        onBack={onBack}
      />
      <Textarea
        value={reason}
        onChange={(event) => {
          setReason(event.target.value);
          if (reasonError) {
            setReasonError("");
          }
        }}
        placeholder="Reason"
        maxLength={500}
        disabled={pending}
      />
      {reasonError ? <p className="text-sm text-text-red">{reasonError}</p> : null}
      <ModalShell.Footer className="pt-0" align="end">
        <ModalShell.Action
          type="button"
          variant="grey-stroke"
          className="h-12 rounded-[14px] text-base font-semibold"
          disabled={pending}
          onClick={onBack}
        >
          Back
        </ModalShell.Action>
        <ModalShell.Action
          type="submit"
          variant="danger"
          className="h-12 rounded-[14px] text-base font-semibold"
          pending={pending}
        >
          {isReject ? "Yes, Reject" : "Yes, Cancel"}
        </ModalShell.Action>
      </ModalShell.Footer>
    </form>
  );
}

const SUCCESS_COPY: Record<CompletedAction, { title: string; description: string }> = {
  approve: {
    title: "Request approved",
    description: "The request was approved and has been sent.",
  },
  reject: {
    title: "Request rejected",
    description: "The maker can see the reason you entered.",
  },
  cancel: {
    title: "Request cancelled",
    description: "This request will not be reviewed.",
  },
};

export function ApprovalDetailsModal({
  open,
  onOpenChange,
  approval,
  scope,
  approvePending = false,
  rejectPending = false,
  cancelPending = false,
  actionPending = false,
  onApprove,
  onReject,
  onCancel,
}: ApprovalDetailsModalProps) {
  const [step, setStep] = React.useState<ApprovalModalStep>("DETAIL");
  const [reasonAction, setReasonAction] = React.useState<ReasonAction>("reject");
  const [completedAction, setCompletedAction] = React.useState<CompletedAction>("approve");
  const [currentUserId] = React.useState(() => Storage.getUser()?.userId ?? "");

  const {
    data: detail,
    isLoading: detailLoading,
    isError: detailError,
  } = useApproval(approval.approvalId, open);

  const resolved = detail ?? approval;
  const actor = actorFor(resolved, currentUserId, scope);
  const success = SUCCESS_COPY[completedAction];
  const reasonPending = reasonAction === "reject" ? rejectPending : cancelPending;

  const stageConfig: Record<ApprovalModalStep, { contentClassName: string; content: ReactNode }> = {
    DETAIL: {
      contentClassName: "max-w-[760px] rounded-xl border-none p-4",
      content: (
        <ApprovalDetailStep
          approval={resolved}
          detailLoading={detailLoading}
          detailError={detailError}
          actor={actor}
          onClose={() => onOpenChange(false)}
          onApprove={() => setStep("CONFIRM_APPROVE")}
          onReject={() => {
            setReasonAction("reject");
            setStep("REASON");
          }}
          onCancel={() => {
            setReasonAction("cancel");
            setStep("REASON");
          }}
        />
      ),
    },
    CONFIRM_APPROVE: {
      contentClassName:
        "w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Approve this request?"
          description="This sends the request the maker submitted. You can only approve a request someone else created."
          confirmLabel="Yes, Approve"
          confirmVariant="success"
          pending={approvePending}
          onCancel={() => setStep("DETAIL")}
          onConfirm={() =>
            onApprove(resolved.approvalId, () => {
              setCompletedAction("approve");
              setStep("SUCCESS");
            })
          }
        />
      ),
    },
    REASON: {
      contentClassName:
        "w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8",
      content: (
        <ReasonStep
          key={reasonAction}
          action={reasonAction}
          pending={reasonPending}
          onBack={() => setStep("DETAIL")}
          onConfirm={(reason) => {
            const succeed = () => {
              setCompletedAction(reasonAction);
              setStep("SUCCESS");
            };
            if (reasonAction === "reject") {
              onReject(resolved.approvalId, reason, succeed);
              return;
            }
            onCancel(resolved.approvalId, reason, succeed);
          }}
        />
      ),
    },
    SUCCESS: {
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={success.title}
          description={success.description}
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
      closeOnBackdropClick={!actionPending}
      shellClassName={activeStage.contentClassName}
    >
      {activeStage.content}
    </ModalShell.Root>
  );
}
