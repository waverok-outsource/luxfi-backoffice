"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  ImageUploadGrid,
  useAssetItemImages,
} from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal/image-upload-grid";
import { QuickAddSearchField } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal/quick-add-search-field";
import {
  addAssetItemSchema,
  type AddAssetItemFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import type { AssetClassType, AssetItemType, WatchChartsSearchResultType } from "@/types/asset-management.type";
import { mapAssetClassToConfigFormValues, resolveAssetConfig } from "@/util/resolve-asset-config";

type AssetItemConfigurationModalProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetItem?: undefined;
      onAssetItemCreated?: (item: AssetItemType) => void;
      onAssetItemUpdated?: never;
      onAssetItemDeleted?: never;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetItem: AssetItemType;
      onAssetItemCreated?: never;
      onAssetItemUpdated?: (assetItemId: string, patch: Partial<AssetItemType>) => void;
      onAssetItemDeleted?: (assetItemId: string) => void;
    };

type ModalStage = "FORM" | "CONFIRM_UPDATE" | "CONFIRM_DELETE" | "SUCCESS";

const CURRENT_YEAR = 2026;
const YEAR_OPTIONS = Array.from({ length: 15 }, (_, index) => String(CURRENT_YEAR - index));

function buildDefaultValues(
  assetClass: AssetClassType,
  assetItem?: AssetItemType,
): AddAssetItemFormValues {
  const resolvedConfig = resolveAssetConfig(
    mapAssetClassToConfigFormValues(assetClass),
    assetItem?.itemConfig,
  );

  return {
    nameOfItem: assetItem?.name ?? "",
    assetCategoryName: assetItem?.assetCategoryName ?? "",
    year: assetItem?.year ?? "",
    caseColour: assetItem?.caseColour ?? "",
    caseSize: assetItem?.caseSize ?? "",
    weight: assetItem?.weight ?? "",
    dialColour: assetItem?.dialColour ?? "",
    overwriteParentClassConfigurations: assetItem?.overwriteParentClassConfigurations ?? false,
    ...resolvedConfig,
  };
}

function splitItemFormValues(values: AddAssetItemFormValues) {
  const {
    nameOfItem,
    assetCategoryName,
    year,
    caseColour,
    caseSize,
    weight,
    dialColour,
    overwriteParentClassConfigurations,
    ...config
  } = values;

  return {
    nameOfItem,
    assetCategoryName,
    year,
    caseColour,
    caseSize,
    weight,
    dialColour,
    overwriteParentClassConfigurations,
    config,
  };
}

function buildAssetItemPatch(
  values: AddAssetItemFormValues,
  images: string[],
  estimatedValue: number,
): Omit<AssetItemType, "assetItemId" | "assetClassId" | "listingStatus" | "createdAt"> {
  const {
    nameOfItem,
    assetCategoryName,
    year,
    caseColour,
    caseSize,
    weight,
    dialColour,
    overwriteParentClassConfigurations,
    config,
  } = splitItemFormValues(values);

  return {
    name: nameOfItem.trim() || "Untitled Asset",
    assetCategoryName: assetCategoryName.trim(),
    year,
    caseColour,
    caseSize,
    weight,
    dialColour,
    estimatedValue,
    images,
    overwriteParentClassConfigurations,
    itemConfig: overwriteParentClassConfigurations ? config : undefined,
  };
}

function buildAssetItem(
  assetClassId: string,
  values: AddAssetItemFormValues,
  images: string[],
  estimatedValue: number,
): AssetItemType {
  return {
    assetItemId: `AI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    assetClassId,
    listingStatus: "unlisted",
    createdAt: new Date().toISOString(),
    ...buildAssetItemPatch(values, images, estimatedValue),
  };
}

export function AssetItemConfigurationModal(props: AssetItemConfigurationModalProps) {
  const { mode, open, onOpenChange, assetClass, assetItem } = props;
  const isEditMode = mode === "edit";

  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const [estimatedValue, setEstimatedValue] = React.useState(assetItem?.estimatedValue ?? 0);
  const [pendingValues, setPendingValues] = React.useState<AddAssetItemFormValues | null>(null);
  const formId = React.useId();

  const { urls: imageUrls, addFiles: addImageFiles, removeAt: removeImageAt } = useAssetItemImages(
    assetItem?.images ?? [],
  );

  // Every step is pre-populated from the resolved parent config, so unlike the
  // class wizard there's no progressive Next/Back gating here — every step is
  // already valid and reachable as soon as the override toggle is on.
  const allStepsCompleted = React.useMemo(() => new Set(ASSET_CLASS_STEP_ORDER), []);

  const { control, setValue, handleSubmit } = useForm<AddAssetItemFormValues>({
    // zodResolver's inferred type traces the schema's pre-coercion input shape
    // (e.g. numeric fields as `unknown`), which structurally conflicts with the
    // post-coercion `AddAssetItemFormValues` used everywhere else in this form
    // (and required by AssetClassConfigWizard's Control<T>). The cast just tells
    // TS to trust the resolver's actual runtime contract instead of that mismatch.
    resolver: zodResolver(addAssetItemSchema) as unknown as Resolver<AddAssetItemFormValues>,
    defaultValues: buildDefaultValues(assetClass, assetItem),
    mode: "all",
  });

  const isOverrideEnabled = useWatch({ control, name: "overwriteParentClassConfigurations" });

  const handleQuickAddSelect = (result: WatchChartsSearchResultType) => {
    setEstimatedValue(result.price);

    const fieldUpdates: [keyof AddAssetItemFormValues, string][] = [
      ["nameOfItem", result.name],
      ["assetCategoryName", result.brand],
      ["year", result.year],
      ["caseColour", result.caseColour],
      ["caseSize", result.caseSize],
      ["weight", result.weight],
      ["dialColour", result.dialColour],
    ];

    fieldUpdates.forEach(([field, value]) => {
      setValue(field, value, { shouldDirty: true, shouldValidate: true });
    });
  };

  const performUpdate = (values: AddAssetItemFormValues) => {
    if (!isEditMode) {
      return;
    }

    props.onAssetItemUpdated?.(assetItem.assetItemId, buildAssetItemPatch(values, imageUrls, estimatedValue));
    setStage("SUCCESS");
  };

  const performDelete = () => {
    if (!isEditMode) {
      return;
    }

    props.onAssetItemDeleted?.(assetItem.assetItemId);
    onOpenChange(false);
  };

  const onSubmit = (values: AddAssetItemFormValues) => {
    if (isEditMode) {
      setPendingValues(values);
      setStage("CONFIRM_UPDATE");
      return;
    }

    props.onAssetItemCreated?.(
      buildAssetItem(assetClass.classId, values, imageUrls, estimatedValue),
    );
    setStage("SUCCESS");
  };

  const modalTitle = "Asset Item Configuration";

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
            title={modalTitle}
            description="Manage and configure Asset Item"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <QuickAddSearchField onSelect={handleQuickAddSelect} />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="font-semibold">Item Description</h3>

              <ImageUploadGrid urls={imageUrls} onAddFiles={addImageFiles} onRemoveAt={removeImageAt} />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <FormField control={control} name="nameOfItem" label="Name of Item" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="assetCategoryName" label="Asset Category" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="year" label="Year" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Options" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="caseColour" label="Case Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="caseSize" label="Case Size" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="weight" label="Weight" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="dialColour" label="Dial Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>
              </div>

              <FormSwitchField
                control={control}
                name="overwriteParentClassConfigurations"
                label="Overwrite Parent Class Configurations"
                description="This will allow you manually customize configurations for this asset Item only"
                size="sm"
                className="border-t border-primary-grey-stroke pt-4"
              />

              {isOverrideEnabled ? (
                <AssetClassConfigWizard
                  control={control}
                  activeStep={activeStep}
                  completedSteps={allStepsCompleted}
                  onStepSelect={setActiveStep}
                  className="border-primary-black/20"
                />
              ) : null}
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            {isEditMode ? (
              <ModalShell.Action
                type="button"
                className="bg-alertSoft-error text-alert-error hover:bg-alertSoft-error/80"
                onClick={() => setStage("CONFIRM_DELETE")}
              >
                Delete
              </ModalShell.Action>
            ) : (
              <ModalShell.Action type="button" variant="grey-stroke" onClick={() => onOpenChange(false)}>
                Close
              </ModalShell.Action>
            )}

            <ModalShell.Action type="submit" form={formId}>
              {isEditMode ? "Update" : "Add Asset"}
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    CONFIRM_UPDATE: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <div className="space-y-6">
          <ModalShell.Header
            title="Update Asset Details?"
            description="You are about to save changes to this asset item details"
          />

          <ModalShell.Footer className="pt-2">
            <ModalShell.Action type="button" variant="grey-stroke" onClick={() => setStage("FORM")}>
              No, Cancel
            </ModalShell.Action>
            <ModalShell.Action
              type="button"
              variant="success"
              onClick={() => pendingValues && performUpdate(pendingValues)}
            >
              Yes, Confirm
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    CONFIRM_DELETE: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[650px]",
      content: (
        <div className="space-y-6">
          <ModalShell.Header
            title="Delete Asset Item?"
            description="You are about to permanently remove this asset item from the inventory."
          />

          <ModalShell.Footer className="pt-2">
            <ModalShell.Action type="button" variant="grey-stroke" onClick={() => setStage("FORM")}>
              No, Cancel
            </ModalShell.Action>
            <ModalShell.Action type="button" variant="danger" onClick={performDelete}>
              Yes, Confirm
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
          title={isEditMode ? "Asset Item Updated" : "Item added to Inventory"}
          description={
            isEditMode
              ? "This asset item's details have been updated successfully"
              : "New asset item has been added to asset inventory"
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
