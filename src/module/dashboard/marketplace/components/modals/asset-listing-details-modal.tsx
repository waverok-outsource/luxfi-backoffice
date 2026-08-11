"use client";

import * as React from "react";

import { ConfirmDialogContent, ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { AssetDetailsPanel, InfoBox } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { ASSET_MARKET_LISTING_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import type { AssetMarketListingType } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type AssetListingDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: AssetMarketListingType;
};

type ModalStage = "FORM" | "CONFIRM_DELETE" | "CONFIRM_UNLIST" | "SUCCESS_SAVE" | "SUCCESS_UNLIST";

function formatDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatValue({ value }: { value: string }) {
  return <p className="text-lg font-semibold text-text-black">{value}</p>;
}

export function AssetListingDetailsModal({
  open,
  onOpenChange,
  listing,
}: AssetListingDetailsModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const statusConfig = ASSET_MARKET_LISTING_STATUS_CONFIG[listing.listingStatus];

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1024px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Asset Listing Details"
            description="Upload details to list asset here"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <InfoBox
              label="Total Available (Quantity)"
              value={<StatValue value={String(listing.qtyAvailable)} />}
            />
            <InfoBox
              label="Total Available (Cost)"
              value={<StatValue value={formatCurrency(listing.totalAmountRemaining.value, listing.totalAmountRemaining.currencyCode)} />}
            />
            <InfoBox
              label="Total Sold (Quantity)"
              value={<StatValue value={String(listing.qtySold)} />}
            />
            <InfoBox
              label="Total Sold (Cost)"
              value={<StatValue value={formatCurrency(listing.totalAmountSold.value, listing.totalAmountSold.currencyCode)} />}
            />
          </div>

          <ModalShell.Body>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AssetDetailsPanel assetDetails={listing.assetDetails} images={listing.assetImages} />
            </div>
          </ModalShell.Body>

          <div className="space-y-3">
            <InfoBox label="Listed By" value={<StatValue value={listing.seller.name} />} />
            <InfoBox
              label="Listing Status"
              value={
                <Badge variant={statusConfig.variant} showStatusDot>
                  {statusConfig.label}
                </Badge>
              }
            />
            <InfoBox label="Last Updated" value={<StatValue value={formatDateLabel(listing.lastUpdated)} />} />
          </div>

          <ModalShell.Footer align="between">
            <ModalShell.Action
              type="button"
              className="bg-alertSoft-error text-alert-error hover:bg-alertSoft-error/80"
              disabled
              title="Not yet supported by the backend"
            >
              Delete
            </ModalShell.Action>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <ModalShell.Action type="button" variant="grey-stroke" disabled title="Not yet supported by the backend">
                Save Changes
              </ModalShell.Action>
              <ModalShell.Action type="button" disabled title="Not yet supported by the backend">
                Unlist Asset
              </ModalShell.Action>
            </div>
          </ModalShell.Footer>
        </div>
      ),
    },
    CONFIRM_DELETE: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[560px] p-6 sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Delete Listing?"
          description="You are about to permanently remove this listing from the marketplace."
          confirmVariant="danger"
          onCancel={() => setStage("FORM")}
          onConfirm={() => onOpenChange(false)}
        />
      ),
    },
    CONFIRM_UNLIST: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[560px] p-6 sm:p-8",
      content: (
        <ConfirmDialogContent
          title="Unlist Asset?"
          description="This asset will be removed from the live marketplace but kept in your listings."
          confirmVariant="success"
          onCancel={() => setStage("FORM")}
          onConfirm={() => onOpenChange(false)}
        />
      ),
    },
    SUCCESS_SAVE: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title="Listing Updated"
          description="This listing's details have been updated successfully"
          onClose={() => onOpenChange(false)}
        />
      ),
    },
    SUCCESS_UNLIST: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title="Asset Unlisted"
          description="This asset has been removed from the live marketplace"
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[stage];

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
