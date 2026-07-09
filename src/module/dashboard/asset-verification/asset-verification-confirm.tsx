"use client";

import { ModalShell } from "@/components/modal";
import type { AssetVerificationPayload } from "@/types/asset-verification.type";

const CONFIRM_COPY: Record<AssetVerificationPayload["targetStatus"], { title: string; description: string }> = {
  verified: {
    title: "Mark as Verified?",
    description: "You are about to mark this asset as verified.",
  },
  rejected: {
    title: "Reject Asset Verification?",
    description: "You are about to reject this asset's verification request.",
  },
  notVerified: {
    title: "Mark as Not Verified?",
    description: "You are about to mark this asset as not verified.",
  },
  pending: {
    title: "Mark as Pending?",
    description: "You are about to mark this asset as pending verification.",
  },
};

type AssetVerificationConfirmProps = {
  payload: AssetVerificationPayload;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AssetVerificationConfirm({ payload, onCancel, onConfirm }: AssetVerificationConfirmProps) {
  const copy = CONFIRM_COPY[payload.targetStatus];

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title={copy.title}
        description={
          payload.targetStatus === "rejected" && payload.rejectionReason
            ? `${copy.description} Reason: ${payload.rejectionReason}`
            : copy.description
        }
      />

      <ModalShell.Footer className="pt-2">
        <ModalShell.Action type="button" variant="grey-stroke" onClick={onCancel}>
          No, Cancel
        </ModalShell.Action>
        <ModalShell.Action type="button" variant="success" onClick={onConfirm}>
          Yes, Confirm
        </ModalShell.Action>
      </ModalShell.Footer>
    </div>
  );
}
