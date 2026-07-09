"use client";

import * as React from "react";

import {
  ConfirmDialogContent,
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { RejectOfferConfirm } from "@/module/dashboard/marketplace/components/modals/reject-offer-confirm";
import type { RejectOfferFormValues } from "@/schema/marketplace.schema";

type ModalStage = "REVIEW" | "CONFIRM_APPROVE" | "CONFIRM_REJECT" | "SUCCESS";

type ResultCopy = { title: string; description: string };

type OfferReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Widens the REVIEW stage shell for flows with side panels (e.g. P2P trade history). */
  reviewShellClassName?: string;
  /** Pending offers show Reject/Approve actions; resolved ones only show Close. */
  isPending: boolean;
  approveLabel: string;
  rejectLabel: string;
  approveDialog: { title: string; description: React.ReactNode };
  rejectDialog: { offerTypeLabel: string; assetName: string; assetId: string; partyName: string };
  approveSuccess: ResultCopy;
  rejectSuccess: ResultCopy;
  onApprove: () => void;
  onReject: (values: RejectOfferFormValues) => void;
  children: React.ReactNode;
};

/**
 * Shared review → confirm → success flow behind every Marketplace offer modal
 * (Liquidation Offers, Buy Offers, P2P Trades, ...). Callers supply the REVIEW
 * stage body as children plus the copy for each prompt; this component owns the
 * stage machine so the prompts stay consistent across submodules.
 */
export function OfferReviewModal({
  open,
  onOpenChange,
  title,
  description = "View and manage customer buy offer here",
  reviewShellClassName = "max-w-[680px] p-4 sm:p-6",
  isPending,
  approveLabel,
  rejectLabel,
  approveDialog,
  rejectDialog,
  approveSuccess,
  rejectSuccess,
  onApprove,
  onReject,
  children,
}: OfferReviewModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("REVIEW");
  const [resultCopy, setResultCopy] = React.useState<ResultCopy>({ title: "", description: "" });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStage("REVIEW");
    }
    onOpenChange(nextOpen);
  };

  const performApprove = () => {
    onApprove();
    setResultCopy(approveSuccess);
    setStage("SUCCESS");
  };

  const performReject = (values: RejectOfferFormValues) => {
    onReject(values);
    setResultCopy(rejectSuccess);
    setStage("SUCCESS");
  };

  const stageConfig: Record<ModalStage, { contentClassName: string; content: React.ReactNode }> = {
    REVIEW: {
      contentClassName: reviewShellClassName,
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title={title}
            description={description}
            showBackButton
            onBack={() => handleOpenChange(false)}
          />

          {children}

          <ModalShell.Footer>
            {isPending ? (
              <>
                <ModalShell.Action type="button" variant="danger" onClick={() => setStage("CONFIRM_REJECT")}>
                  {rejectLabel}
                </ModalShell.Action>
                <ModalShell.Action type="button" variant="success" onClick={() => setStage("CONFIRM_APPROVE")}>
                  {approveLabel}
                </ModalShell.Action>
              </>
            ) : (
              <ModalShell.Action type="button" variant="grey-stroke" onClick={() => handleOpenChange(false)}>
                Close
              </ModalShell.Action>
            )}
          </ModalShell.Footer>
        </div>
      ),
    },
    CONFIRM_APPROVE: {
      contentClassName: "max-w-[560px] p-6 sm:p-8",
      content: (
        <ConfirmDialogContent
          title={approveDialog.title}
          description={approveDialog.description}
          confirmVariant="success"
          onCancel={() => setStage("REVIEW")}
          onConfirm={performApprove}
        />
      ),
    },
    CONFIRM_REJECT: {
      contentClassName: "max-w-[650px]",
      content: (
        <RejectOfferConfirm
          offerTypeLabel={rejectDialog.offerTypeLabel}
          assetName={rejectDialog.assetName}
          assetId={rejectDialog.assetId}
          partyName={rejectDialog.partyName}
          onCancel={() => setStage("REVIEW")}
          onConfirm={performReject}
        />
      ),
    },
    SUCCESS: {
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={resultCopy.title}
          description={resultCopy.description}
          onClose={() => handleOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, content } = stageConfig[stage];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={handleOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}
