"use client";

import type { ReactNode } from "react";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import {
  AssetPortfolioApproveConfirmStepContent,
  AssetPortfolioInfoStepContent,
  AssetPortfolioRejectStepContent,
} from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal-content";
import type {
  AssetPortfolioRecord,
  AssetPortfolioStep,
  AssetVerificationPayload,
} from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-types";

type AssetPortfolioModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetPortfolioRecord | null;
  step: AssetPortfolioStep;
  onStepChange: (step: AssetPortfolioStep) => void;
  onRequestApprove: (payload: AssetVerificationPayload) => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
  onUnverify: () => void;
  resultMessage: { title: string; description: string } | null;
};

export function AssetPortfolioModal({
  open,
  onOpenChange,
  asset,
  step,
  onStepChange,
  onRequestApprove,
  onConfirmApprove,
  onConfirmReject,
  onUnverify,
  resultMessage,
}: AssetPortfolioModalProps) {
  if (!asset) return null;

  const stageConfig: Record<
    AssetPortfolioStep,
    { contentClassName: string; closeOnBackdropClick: boolean; content: ReactNode }
  > = {
    INFO: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1200px] p-6 sm:p-8",
      content: (
        <AssetPortfolioInfoStepContent
          asset={asset}
          onClose={() => onOpenChange(false)}
          onStepChange={onStepChange}
          onRequestApprove={onRequestApprove}
          onUnverify={onUnverify}
        />
      ),
    },
    REJECT: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[680px]",
      content: (
        <AssetPortfolioRejectStepContent
          borrowerName={asset.borrowerName}
          onStepChange={onStepChange}
          onConfirmReject={onConfirmReject}
        />
      ),
    },
    APPROVE_CONFIRM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <AssetPortfolioApproveConfirmStepContent
          assetId={asset.assetId}
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
          secondaryLabel="View Asset"
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
