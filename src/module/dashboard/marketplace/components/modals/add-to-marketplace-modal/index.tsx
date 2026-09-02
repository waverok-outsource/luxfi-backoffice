"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell, SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME, SuccessModalContent } from "@/components/modal";
import { AssetSearchField } from "@/module/dashboard/marketplace/components/modals/add-to-marketplace-modal/asset-search-field";
import { AssetDetailsPanel, AssetValuationPanel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import useMarketplaceFns from "@/services/functions/marketplace.fns";
import { addToMarketplaceSchema, type AddToMarketplaceFormValues } from "@/schema/marketplace.schema";
import type { AssetItemType } from "@/types/asset-management.type";

type AddToMarketplaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ModalStage = "FORM" | "SUCCESS";

const DEFAULT_VALUES: AddToMarketplaceFormValues = {
  unitListingPrice: "",
  quantity: "",
  boxPackaged: false,
  certificationPapersAvailable: false,
  additionalInformation: "",
};

function getDefaultValuesForAsset(assetItem: AssetItemType): AddToMarketplaceFormValues {
  return {
    unitListingPrice: String(assetItem.price.value),
    quantity: "",
    boxPackaged: assetItem.isBoxed,
    certificationPapersAvailable: assetItem.hasPapers,
    additionalInformation: "",
  };
}

export function AddToMarketplaceModal({ open, onOpenChange }: AddToMarketplaceModalProps) {
  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [selectedAssetItem, setSelectedAssetItem] = React.useState<AssetItemType | null>(null);
  const { createListing, loading } = useMarketplaceFns();
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

    createListing(
      {
        quantity: Number(values.quantity),
        price: {
          value: Number(values.unitListingPrice),
          currencyCode: selectedAssetItem.price.currencyCode,
        },
        assetId: selectedAssetItem.assetId,
        notes: values.additionalInformation?.trim() || undefined,
        isBoxed: values.boxPackaged,
        hasPapers: values.certificationPapersAvailable,
      },
      () => {
        setStage("SUCCESS");
      },
    );
  };

  const handleSelectAsset = (assetItem: AssetItemType) => {
    setSelectedAssetItem(assetItem);
    reset(getDefaultValuesForAsset(assetItem));
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

          <AssetSearchField onSelect={handleSelectAsset} />

          <ModalShell.Body>
            <form
              id={formId}
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <AssetDetailsPanel
                assetDetails={
                  selectedAssetItem
                    ? {
                        dialColour: selectedAssetItem.dialColour,
                        productionYear: selectedAssetItem.productionYear,
                        weight: selectedAssetItem.weight,
                        case: selectedAssetItem.case,
                        category: selectedAssetItem.assetCategoryName,
                        assetType: selectedAssetItem.assetType ?? "",
                        assetId: selectedAssetItem.assetId,
                        assetName: selectedAssetItem.name,
                        assetClass: selectedAssetItem.assetClass.name,
                        hasPapers: selectedAssetItem.hasPapers,
                        isBoxed: selectedAssetItem.isBoxed,
                      }
                    : null
                }
                images={selectedAssetItem?.uploads ?? []}
              />
              <AssetValuationPanel
                assetItem={selectedAssetItem}
                control={control}
                disabled={!selectedAssetItem}
              />
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            <ModalShell.Action
              type="submit"
              form={formId}
              disabled={!selectedAssetItem || loading.CREATE_LISTING}
              pending={loading.CREATE_LISTING}
            >
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
