"use client";

import * as React from "react";

import { ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { AssetVerificationConfirm } from "@/module/dashboard/asset-verification/asset-verification-confirm";
import { AssetVerificationForm } from "@/module/dashboard/asset-verification/asset-verification-form";
import { BlacklistAssetConfirm } from "@/module/dashboard/asset-verification/blacklist-asset-confirm";
import type { BlacklistAssetFormValues } from "@/schema/asset-verification.schema";
import type {
  AssetVerificationPayload,
  AssetVerificationRecord,
  AssetVerificationStatus,
  AssetVerificationStep,
  BlacklistAssetPayload,
} from "@/types/asset-verification.type";

const STATUS_RESULT_COPY: Record<AssetVerificationStatus, { title: string; description: string }> = {
  verified: {
    title: "Asset Verification Approved",
    description: "The selected asset has been marked as verified successfully.",
  },
  rejected: {
    title: "Asset Verification Rejected",
    description: "The selected asset's verification request has been rejected.",
  },
  notVerified: {
    title: "Asset Marked Not Verified",
    description: "The selected asset has been marked as not verified.",
  },
  pending: {
    title: "Asset Details Updated",
    description: "The selected asset's details have been updated successfully.",
  },
};

type AssetVerificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetVerificationRecord;
  availableStatuses: AssetVerificationStatus[];
  enableBlacklist?: boolean;
  onSave: (payload: AssetVerificationPayload) => void;
  onBlacklist?: (payload: BlacklistAssetPayload) => void;
};

export function AssetVerificationModal({
  open,
  onOpenChange,
  asset,
  availableStatuses,
  enableBlacklist = false,
  onSave,
  onBlacklist,
}: AssetVerificationModalProps) {
  const [step, setStep] = React.useState<AssetVerificationStep>("FORM");
  const [pendingPayload, setPendingPayload] = React.useState<AssetVerificationPayload | null>(null);
  const [resultMessage, setResultMessage] = React.useState<{ title: string; description: string } | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep("FORM");
      setPendingPayload(null);
      setResultMessage(null);
    }
    onOpenChange(nextOpen);
  };

  const handleRequestSave = (payload: AssetVerificationPayload) => {
    if (payload.targetStatus === asset.status) {
      onSave(payload);
      setResultMessage(STATUS_RESULT_COPY.pending);
      setStep("RESULT");
      return;
    }

    setPendingPayload(payload);
    setStep("CONFIRM_STATUS_CHANGE");
  };

  const handleConfirmStatusChange = () => {
    if (!pendingPayload) return;

    onSave(pendingPayload);
    setResultMessage(STATUS_RESULT_COPY[pendingPayload.targetStatus]);
    setPendingPayload(null);
    setStep("RESULT");
  };

  const handleConfirmBlacklist = (values: BlacklistAssetFormValues) => {
    onBlacklist?.({ assetId: asset.id, ...values });
    setResultMessage({
      title: "Asset Blacklisted",
      description: "This asset has been blacklisted and flagged in the system.",
    });
    setStep("RESULT");
  };

  const stageConfig: Record<
    AssetVerificationStep,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1200px] p-6 sm:p-8",
      content: (
        <AssetVerificationForm
          asset={asset}
          availableStatuses={availableStatuses}
          enableBlacklist={enableBlacklist}
          onClose={() => handleOpenChange(false)}
          onRequestSave={handleRequestSave}
          onRequestBlacklist={() => setStep("CONFIRM_BLACKLIST")}
        />
      ),
    },
    CONFIRM_STATUS_CHANGE: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: pendingPayload ? (
        <AssetVerificationConfirm
          payload={pendingPayload}
          onCancel={() => setStep("FORM")}
          onConfirm={handleConfirmStatusChange}
        />
      ) : null,
    },
    CONFIRM_BLACKLIST: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <BlacklistAssetConfirm
          assetId={asset.assetId}
          onCancel={() => setStep("FORM")}
          onConfirm={handleConfirmBlacklist}
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
          onClose={() => handleOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[step];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={handleOpenChange}
      showCloseButton={false}
      closeOnBackdropClick={closeOnBackdropClick}
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}
