"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ConfirmDialogContent, ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { AssetDetailsPanel, AssetValuationPanel, InfoBox } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { LISTING_STATUS_CONFIG, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import { addToMarketplaceSchema, type AddToMarketplaceFormValues } from "@/schema/marketplace.schema";
import type { MarketplaceListingType } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type AssetListingDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: MarketplaceListingType;
  onListingUpdated: (listingId: string, patch: Partial<MarketplaceListingType>) => void;
  onListingDeleted: (listingId: string) => void;
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
  onListingUpdated,
  onListingDeleted,
}: AssetListingDetailsModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const assetItem = resolveAssetItemById(listing.assetItemId) ?? null;
  const statusConfig = LISTING_STATUS_CONFIG[listing.listingStatus];

  const { control, handleSubmit } = useForm<AddToMarketplaceFormValues>({
    resolver: zodResolver(addToMarketplaceSchema),
    defaultValues: {
      unitListingPrice: String(listing.listingPrice),
      additionalInformation: listing.additionalInfo,
      isBoxPackaged: listing.isBoxPackaged,
      hasCertificationPapers: listing.hasCertificationPapers,
    },
    mode: "all",
  });
  const formId = React.useId();

  const onSaveChanges = (values: AddToMarketplaceFormValues) => {
    onListingUpdated(listing.listingId, {
      listingPrice: Number(values.unitListingPrice),
      additionalInfo: values.additionalInformation,
      isBoxPackaged: values.isBoxPackaged,
      hasCertificationPapers: values.hasCertificationPapers,
      lastUpdatedAt: new Date().toISOString(),
    });
    setStage("SUCCESS_SAVE");
  };

  const performUnlist = () => {
    onListingUpdated(listing.listingId, {
      listingStatus: "unlisted",
      lastUpdatedAt: new Date().toISOString(),
    });
    setStage("SUCCESS_UNLIST");
  };

  const performDelete = () => {
    onListingDeleted(listing.listingId);
    onOpenChange(false);
  };

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
              value={<StatValue value={String(listing.totalAvailableQuantity)} />}
            />
            <InfoBox
              label="Total Available (Cost)"
              value={<StatValue value={formatCurrency(listing.totalAvailableCost)} />}
            />
            <InfoBox
              label="Total Sold (Quantity)"
              value={<StatValue value={String(listing.totalSoldQuantity)} />}
            />
            <InfoBox
              label="Total Sold  (Cost)"
              value={<StatValue value={formatCurrency(listing.totalSoldCost)} />}
            />
          </div>

          <ModalShell.Body>
            <form
              id={formId}
              onSubmit={handleSubmit(onSaveChanges)}
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <AssetDetailsPanel assetItem={assetItem} />
              <AssetValuationPanel assetItem={assetItem} control={control} />
            </form>
          </ModalShell.Body>

          <div className="space-y-3">
            <InfoBox label="Listed By" value={<StatValue value={listing.listedBy} />} />
            <InfoBox
              label="Listing Status"
              value={
                <Badge variant={statusConfig.variant} showStatusDot>
                  {statusConfig.label}
                </Badge>
              }
            />
            <InfoBox label="Last Updated" value={<StatValue value={formatDateLabel(listing.lastUpdatedAt)} />} />
          </div>

          <ModalShell.Footer align="between">
            <ModalShell.Action
              type="button"
              className="bg-alertSoft-error text-alert-error hover:bg-alertSoft-error/80"
              onClick={() => setStage("CONFIRM_DELETE")}
            >
              Delete
            </ModalShell.Action>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <ModalShell.Action type="submit" form={formId} variant="grey-stroke">
                Save Changes
              </ModalShell.Action>
              <ModalShell.Action type="button" onClick={() => setStage("CONFIRM_UNLIST")}>
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
          onConfirm={performDelete}
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
          onConfirm={performUnlist}
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
