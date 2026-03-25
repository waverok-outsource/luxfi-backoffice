"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { CircleAlert, KeyRound } from "lucide-react";

import {
  ModalDetailRow,
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { getPasswordResetStatusConfig } from "@/module/dashboard/help-support/components/status-config";
import type { PasswordResetRequestRow } from "@/module/dashboard/help-support/data";

type PasswordResetRequestDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PasswordResetRequestRow;
  onReset: (requestId: string) => void;
};

type PasswordResetModalStep = "DETAIL" | "SUCCESS";

export function PasswordResetRequestDetailsModal({
  open,
  onOpenChange,
  request,
  onReset,
}: PasswordResetRequestDetailsModalProps) {
  const [step, setStep] = React.useState<PasswordResetModalStep>("DETAIL");
  const status = getPasswordResetStatusConfig(request.status);
  const isReset = request.status === "reset";

  const stageConfig: Record<
    PasswordResetModalStep,
    { contentClassName: string; content: ReactNode }
  > = {
    DETAIL: {
      contentClassName: "max-w-[646px] rounded-xl border-none p-4",
      content: (
        <div className="space-y-6">
          <ModalShell.Header
            title="Member Password Request"
            description="View and manage access request"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body className="rounded-xl px-6 py-8">
            <div className="space-y-[14px]">
              <ModalDetailRow label="Log ID:" value={request.logId} copyText={request.logId} />
              <ModalDetailRow
                label="Username"
                value={request.username}
                copyText={request.username}
              />
              <ModalDetailRow
                label="User Email Address:"
                value={request.userEmail}
                copyText={request.userEmail}
              />
              <ModalDetailRow label="Channel:" value={request.channel} />

              <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

              <ModalDetailRow label="Date:" value={request.dateLabel} />
              <ModalDetailRow label="Timestamp:" value={request.timestampLabel} />
              <ModalDetailRow
                label="Reset Status"
                value={
                  <Badge variant={status.variant} showStatusDot>
                    {status.label}
                  </Badge>
                }
              />

              <div className="mx-auto h-px w-[297px] bg-primary-grey-stroke/80" />

              <p className="text-center text-base font-medium text-text-grey">
                Password Reset valid for only 30 minutes of request
              </p>
            </div>
          </ModalShell.Body>

          <ModalShell.Footer className="pt-0" align="end">
            {isReset ? (
              <ModalShell.Action
                type="button"
                className="h-12 rounded-[14px] text-base font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Close
              </ModalShell.Action>
            ) : (
              <ModalShell.Action
                type="button"
                className="h-12 rounded-[14px] text-base font-semibold"
                onClick={() => {
                  onReset(request.id);
                  setStep("SUCCESS");
                }}
              >
                <KeyRound className="h-4 w-4" />
                Reset User Password
              </ModalShell.Action>
            )}
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title="Reset Link has been sent to user email address."
          description="User will be notified with password reset link via email"
          onClose={() => onOpenChange(false)}
          icon={<CircleAlert className="size-8 text-text-green" strokeWidth={2.5} />}
          iconWrapperClassName="bg-alertSoft-success text-text-green"
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
      closeOnBackdropClick
      shellClassName={activeStage.contentClassName}
    >
      {activeStage.content}
    </ModalShell.Root>
  );
}
