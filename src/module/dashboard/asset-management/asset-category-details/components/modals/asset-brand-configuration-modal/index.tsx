"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField } from "@/components/util/form-controller";
import { addAssetBrandSchema, type AddAssetBrandFormValues } from "@/schema/asset-management.schema";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import type { AssetBrandStatus, AssetBrandType, AssetCategoryType } from "@/types/asset-management.type";
import { normalizeAssetBrandStatus } from "@/module/dashboard/asset-management/asset-category-details/data";

type AssetBrandConfigurationModalProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetCategory: AssetCategoryType;
      assetBrand?: undefined;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetCategory: AssetCategoryType;
      assetBrand: AssetBrandType;
    };

type ModalStage = "FORM" | "SUCCESS";

function buildDefaultValues(
  assetBrand?: AssetBrandType,
): AddAssetBrandFormValues {
  return {
    brandName: assetBrand?.name ?? "",
    status: assetBrand ? normalizeAssetBrandStatus(assetBrand.status) : "published",
  };
}

export function AssetBrandConfigurationModal(props: AssetBrandConfigurationModalProps) {
  const { mode, open, onOpenChange, assetCategory, assetBrand } = props;
  const isEditMode = mode === "edit";

  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const formId = React.useId();
  const { createAssetBrand, updateAssetBrand, loading } = useAssetManagementFns();

  const { control, handleSubmit } = useForm<AddAssetBrandFormValues>({
    resolver: zodResolver(addAssetBrandSchema),
    defaultValues: buildDefaultValues(assetBrand),
    mode: "all",
  });

  const onSubmit = (values: AddAssetBrandFormValues) => {
    const status: AssetBrandStatus = values.status === "published" ? "published" : "draft";
    const payload = {
      name: values.brandName.trim(),
      category: assetCategory.assetCategoryId,
      status,
    };

    if (isEditMode) {
      updateAssetBrand(assetBrand.brandId, payload, () => setStage("SUCCESS"));
      return;
    }

    createAssetBrand(payload, () => setStage("SUCCESS"));
  };

  const isSaving = isEditMode ? loading.UPDATE_ASSET_BRAND : loading.CREATE_ASSET_BRAND;

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Asset Brand Configuration"
            description="Manage and configure Asset Brand"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField control={control} name="brandName" label="Brand Name" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <div className="space-y-1.5">
                  <Label>
                    Parent Category<span className="text-red-500">*</span>
                  </Label>
                  <Input value={assetCategory.name} disabled readOnly />
                </div>
              </div>

              <FormField
                control={control}
                name="status"
                className="border-t border-primary-grey-stroke pt-4"
              >
                {({ field }) => (
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">Published</Label>
                      <FieldDescription>Make this brand visible/discoverable</FieldDescription>
                    </div>
                    <FormControl>
                      <Switch
                        size="sm"
                        checked={field.value === "published"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "published" : "unpublished")
                        }
                      />
                    </FormControl>
                  </div>
                )}
              </FormField>
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            <ModalShell.Action type="button" variant="grey-stroke" onClick={() => onOpenChange(false)}>
              Close
            </ModalShell.Action>

            <ModalShell.Action type="submit" form={formId} pending={isSaving}>
              {isEditMode ? "Update" : "Save"}
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={isEditMode ? "Asset Brand Updated" : "Asset Brand Created"}
          description={
            isEditMode
              ? "This asset brand's details have been updated successfully"
              : "New asset brand has been added to this category"
          }
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
