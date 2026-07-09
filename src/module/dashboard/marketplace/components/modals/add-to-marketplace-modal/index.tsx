"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { AssetSearchField } from "@/module/dashboard/marketplace/components/modals/add-to-marketplace-modal/asset-search-field";
import { AssetDetailsPanel, AssetValuationPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { addToMarketplaceSchema, type AddToMarketplaceFormValues } from "@/schema/marketplace.schema";
import type { AssetItemType } from "@/types/asset-management.type";
import type { MarketplaceListingType } from "@/types/marketplace.type";

type AddToMarketplaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onListingCreated: (listing: MarketplaceListingType) => void;
};

type ModalStage = "FORM" | "SUCCESS";

const DEFAULT_VALUES: AddToMarketplaceFormValues = {
  unitListingPrice: "",
  additionalInformation: "",
  isBoxPackaged: false,
  hasCertificationPapers: false,
};

function buildListing(
  assetItem: AssetItemType,
  values: AddToMarketplaceFormValues,
): MarketplaceListingType {
  const now = new Date().toISOString();

  return {
    listingId: `MKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    assetItemId: assetItem.assetItemId,
    assetClassId: assetItem.assetClassId,
    listingPrice: Number(values.unitListingPrice),
    additionalInfo: values.additionalInformation,
    isBoxPackaged: values.isBoxPackaged,
    hasCertificationPapers: values.hasCertificationPapers,
    listedBy: "Admin@pawnshopbyblu.com",
    listingStatus: "listed",
    listedAt: now,
    lastUpdatedAt: now,
    totalAvailableQuantity: 1,
    totalAvailableCost: assetItem.estimatedValue,
    totalSoldQuantity: 0,
    totalSoldCost: 0,
  };
}

export function AddToMarketplaceModal({ open, onOpenChange, onListingCreated }: AddToMarketplaceModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [selectedAssetItem, setSelectedAssetItem] = React.useState<AssetItemType | null>(null);
  const formId = React.useId();

  const { control, handleSubmit, reset } = useForm<AddToMarketplaceFormValues>({
    resolver: zodResolver(addToMarketplaceSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const onSubmit = (values: AddToMarketplaceFormValues) => {
    if (!selectedAssetItem) {
      return;
    }

    onListingCreated(buildListing(selectedAssetItem, values));
    setStage("SUCCESS");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStage("FORM");
      setSelectedAssetItem(null);
      reset(DEFAULT_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const stageConfig: Record<ModalStage, { contentClassName: string; content: React.ReactNode }> = {
    FORM: {
      contentClassName: "max-w-[1024px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Add To Marketplace"
            description="Upload details to list asset here"
            showBackButton
            onBack={() => handleOpenChange(false)}
          />

          <AssetSearchField onSelect={setSelectedAssetItem} />

          <ModalShell.Body>
            <form
              id={formId}
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <AssetDetailsPanel assetItem={selectedAssetItem} />
              <AssetValuationPanel
                assetItem={selectedAssetItem}
                control={control}
                disabled={!selectedAssetItem}
              />
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            <ModalShell.Action type="submit" form={formId} disabled={!selectedAssetItem}>
              Submit for Listing
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title="Listed on Marketplace"
          description="This asset has been added to the marketplace listing"
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
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}
