"use client";

import type { ReactNode } from "react";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import {
  SmartContractApproveConfirmStepContent,
  SmartContractInfoStepContent,
  SmartContractRejectStepContent,
} from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-modal-content";
import type { SmartContractRecord } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-types";
import type {
  LoanCaseApprovalPayload,
  LoanCaseFlowStep,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-flow";

type SmartContractModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: SmartContractRecord | null;
  step: LoanCaseFlowStep;
  onStepChange: (step: LoanCaseFlowStep) => void;
  onRequestApprove: (payload: LoanCaseApprovalPayload) => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
  resultMessage: { title: string; description: string } | null;
};

export function SmartContractModal({
  open,
  onOpenChange,
  contract,
  step,
  onStepChange,
  onRequestApprove,
  onConfirmApprove,
  onConfirmReject,
  resultMessage,
}: SmartContractModalProps) {
  if (!contract) return null;

  const stageConfig: Record<
    LoanCaseFlowStep,
    { contentClassName: string; closeOnBackdropClick: boolean; content: ReactNode }
  > = {
    INFO: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1200px] p-6 sm:p-8",
      content: (
        <SmartContractInfoStepContent
          contract={contract}
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
        <SmartContractRejectStepContent
          borrowerName={contract.borrowerName}
          onStepChange={onStepChange}
          onConfirmReject={onConfirmReject}
        />
      ),
    },
    APPROVE_CONFIRM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <SmartContractApproveConfirmStepContent
          onStepChange={onStepChange}
          onConfirm={onConfirmApprove}
        />
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
