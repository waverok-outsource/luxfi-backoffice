"use client";

import * as React from "react";
import { toast } from "sonner";

import { ConfirmDialogContent, ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { AssetDetailsPanel, DetailField, InfoBox, formatDateLabel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { CustomerListingValuationPanel } from "@/module/dashboard/marketplace/components/modals/customer-listing-valuation-panel";
import { CUSTOMER_LISTING_STATUS_CONFIG, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { CustomerListingType } from "@/types/marketplace.type";

type CustomerListingReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: CustomerListingType;
  onListingUpdated: (listingId: string, patch: Partial<CustomerListingType>) => void;
};

type ModalStage = "REVIEW" | "CONFIRM_APPROVE" | "CONFIRM_REJECT" | "SUCCESS";

export function CustomerListingReviewModal({
  open,
  onOpenChange,
  listing,
  onListingUpdated,
}: CustomerListingReviewModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("REVIEW");
  const [resultCopy, setResultCopy] = React.useState({ title: "", description: "" });
  const assetItem = resolveAssetItemById(listing.assetItemId) ?? null;
  const statusConfig = CUSTOMER_LISTING_STATUS_CONFIG[listing.listingStatus];
  const isPending = listing.listingStatus === "pending";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStage("REVIEW");
    }
    onOpenChange(nextOpen);
  };

  const performApprove = () => {
    onListingUpdated(listing.listingId, { listingStatus: "active", lastUpdatedAt: new Date().toISOString() });
    setResultCopy({
      title: "Listing Approved",
      description: "This customer listing is now live on the marketplace.",
    });
    setStage("SUCCESS");
  };

  const performReject = () => {
    onListingUpdated(listing.listingId, { listingStatus: "rejected", lastUpdatedAt: new Date().toISOString() });
    setResultCopy({
      title: "Listing Rejected",
      description: "This customer listing has been rejected.",
    });
    setStage("SUCCESS");
  };

  const handleTriggerBuyOffer = () => {
    toast.success("Buy offer triggered for this listing");
  };

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    REVIEW: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1024px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Asset Listing Details"
            description={isPending ? "Upload details to list asset here" : "Review asset listing here"}
            showBackButton
            onBack={() => handleOpenChange(false)}
          />

          <ModalShell.Body>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AssetDetailsPanel
                assetItem={assetItem}
                extraRows={
                  <div className="grid grid-cols-2 gap-y-2 border-t border-primary-grey-stroke pt-4">
                    <DetailField label="Box-Packaged" value={listing.isBoxPackaged ? "YES" : "NO"} />
                    <DetailField label="Papers Available" value={listing.hasCertificationPapers ? "YES" : "NO"} />
                  </div>
                }
              />
              <CustomerListingValuationPanel
                assetItem={assetItem}
                listing={listing}
                onTriggerBuyOffer={handleTriggerBuyOffer}
              />
            </div>
          </ModalShell.Body>

          <div className="space-y-3">
            <InfoBox
              label="Listing Status"
              value={
                <Badge variant={statusConfig.variant} showStatusDot>
                  {statusConfig.label}
                </Badge>
              }
            />
            <InfoBox
              label={isPending ? "Date Uploaded" : "Date Listed"}
              value={<p className="text-lg font-semibold text-text-black">{formatDateLabel(listing.submittedAt)}</p>}
            />
            <InfoBox
              label="Listed By"
              value={
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
                    Customer
                  </Badge>
                  <span className="font-semibold text-text-black">{listing.customerName}</span>
                </div>
              }
            />
          </div>

          <ModalShell.Footer>
            {isPending ? (
              <>
                <ModalShell.Action type="button" variant="danger" onClick={() => setStage("CONFIRM_REJECT")}>
                  Reject Listing
                </ModalShell.Action>
                <ModalShell.Action type="button" variant="success" onClick={() => setStage("CONFIRM_APPROVE")}>
                  Approve Listing
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
      closeOnBackdropClick: true,
      contentClassName: "max-w-[560px] p-6 sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Approve Listing?"
          description="This asset will go live on the marketplace for buyers to see."
          confirmVariant="success"
          onCancel={() => setStage("REVIEW")}
          onConfirm={performApprove}
        />
      ),
    },
    CONFIRM_REJECT: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[560px] p-6 sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Reject Listing?"
          description="The customer will be notified that this listing was not approved."
          confirmVariant="danger"
          onCancel={() => setStage("REVIEW")}
          onConfirm={performReject}
        />
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
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

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[stage];

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
