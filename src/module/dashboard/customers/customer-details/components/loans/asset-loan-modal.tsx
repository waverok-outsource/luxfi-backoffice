"use client";

import type { ReactNode } from "react";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import type { AssetLoan } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";
import {
  ApproveConfirmStepContent,
  InfoStepContent,
  RejectStepContent,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-content";
import type { AssetLoanApprovalPayload, AssetLoanStep } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-types";

type AssetLoanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: AssetLoan | null;
  step: AssetLoanStep;
  onStepChange: (step: AssetLoanStep) => void;
  onRequestApprove: (payload: AssetLoanApprovalPayload) => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
  resultMessage: { title: string; description: string } | null;
};

export type { AssetLoanApprovalPayload, AssetLoanStep };

export function AssetLoanModal({
  open,
  onOpenChange,
  loan,
  step,
  onStepChange,
  onRequestApprove,
  onConfirmApprove,
  onConfirmReject,
  resultMessage,
}: AssetLoanModalProps) {
  if (!loan) return null;

  const stageConfig: Record<
    AssetLoanStep,
    { contentClassName: string; closeOnBackdropClick: boolean; content: ReactNode }
  > = {
    INFO: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1200px] p-6 sm:p-8",
      content: (
        <InfoStepContent
          loan={loan}
          onClose={() => onOpenChange(false)}
          onStepChange={onStepChange}
          onRequestApprove={onRequestApprove}
        />
      ),
    },
    REJECT: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[682px]",
      content: (
        <RejectStepContent
          borrowerName={loan.borrowerName}
          onStepChange={onStepChange}
          onConfirmReject={onConfirmReject}
        />
      ),
    },
    APPROVE_CONFIRM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <ApproveConfirmStepContent onStepChange={onStepChange} onConfirm={onConfirmApprove} />
      ),
    },
    RESULT: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={resultMessage?.title ?? ""}
          description={resultMessage?.description ?? ""}
          onClose={() => onOpenChange(false)}
          secondaryLabel="View Loan"
          onSecondary={() => onStepChange("INFO")}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[step];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick={closeOnBackdropClick}
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}
