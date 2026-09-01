"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormControl,
  FormCurrencyInput,
  FormDatePicker,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  ImageUploadGrid,
  useAssetItemImages,
} from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal/image-upload-grid";
import { QuickAddSearchField } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal/quick-add-search-field";
import {
  addAssetItemSchema,
  COLOUR_VARIANT_VALUES,
  CURRENCY_VALUES,
  OWNERSHIP_TYPE_VALUES,
  WEIGHT_UNIT_VALUES,
  type AddAssetItemFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import type {
  AssetClassType,
  AssetItemType,
  AssetQuickSearchResultType,
  CreateAssetClassPayloadType,
} from "@/types/asset-management.type";
import { mapAssetClassToConfigFormValues, resolveAssetConfig } from "@/util/resolve-asset-config";
import { toTitleCase } from "@/util/helper";
import { parseCurrencyToNumber } from "@/util/format-currency";

type AssetItemConfigurationModalProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetItem?: undefined;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetItem: AssetItemType;
    };

type ModalStage = "FORM" | "CONFIRM_UPDATE" | "CONFIRM_DELETE" | "SUCCESS";

const ASSET_TYPE_LABELS: Record<string, string> = {
  tangible: "Tangible Asset",
  digital: "Digital Asset",
};

function AssetTypeBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="neutral"
      className="gap-1.5 border border-primary-black bg-alertSoft-warning text-text-amber"
    >
      <CheckCircle2 className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function buildDefaultValues(
  assetClass: AssetClassType,
  assetItem?: AssetItemType,
): AddAssetItemFormValues {
  const resolvedConfig = resolveAssetConfig(
    mapAssetClassToConfigFormValues(assetClass),
    assetItem?.configuration ? mapAssetClassToConfigFormValues(assetItem.configuration) : undefined,
  );

  return {
    name: assetItem?.name ?? "",
    modelNumber: "",
    price: assetItem?.price ?? { value: undefined, currencyCode: CURRENCY_VALUES[0] },
    retailPrice: undefined,
    productionYear: assetItem?.productionYear ?? "",
    ownershipType: "",
    colourVariants: [],
    hasPapers: assetItem?.hasPapers ?? false,
    isBoxed: assetItem?.isBoxed ?? false,
    weight: assetItem?.weight ?? { value: 0, unit: WEIGHT_UNIT_VALUES[0] },
    overrideParentClassConfigurations: assetItem?.overrideParentClassConfigurations ?? false,
    assetCategoryId: assetItem?.assetCategoryId ?? "",
    dialColour: assetItem?.dialColour ?? "",
    case: assetItem?.case ?? { colour: "", size: 0, unit: "mm" },
    ...resolvedConfig,
  };
}

function buildAssetBasePayload(values: AddAssetItemFormValues) {
  return {
    name: values.name.trim(),
    modelNumber: values.modelNumber || undefined,
    // price.value is guaranteed defined here — enforced by the price schema's superRefine
    price: { value: values.price.value ?? 0, currencyCode: values.price.currencyCode },
    retailPrice: values.retailPrice,
    productionYear: values.productionYear,
    ownershipType: values.ownershipType || undefined,
    colourVariants: values.colourVariants.length > 0 ? values.colourVariants : undefined,
    hasPapers: values.hasPapers,
    isBoxed: values.isBoxed,
    weight: values.weight,
    // API compatibility fields — not collected in UI
    assetCategoryId: values.assetCategoryId,
    dialColour: values.dialColour,
    case: values.case,
  };
}

function buildAssetConfigurationPayload(
  assetClass: AssetClassType,
  itemName: string,
  values: AddAssetItemFormValues,
): Omit<CreateAssetClassPayloadType, "description"> {
  return {
    assetType: assetClass.assetType,
    name: itemName.trim(),
    status: assetClass.status,
    valuationLogic: values.valuationLogic,
    liquidityProfile: values.liquidityProfile,
    loanEligibility: values.loanEligibility,
    purchaseOfferLogic: values.purchaseOfferLogic,
    marketPlace: values.marketPlace,
    riskSettings: values.riskSettings,
    underwritingControls: values.underwritingControls,
    investorEligibility: values.investorEligibility,
  };
}

export function AssetItemConfigurationModal(props: AssetItemConfigurationModalProps) {
  const { mode, open, onOpenChange, assetClass, assetItem } = props;
  const isEditMode = mode === "edit";

  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const [pendingValues, setPendingValues] = React.useState<AddAssetItemFormValues | null>(null);
  const formId = React.useId();

  const { createAsset, updateAsset, deleteAsset, loading } = useAssetManagementFns();

  const {
    urls: imageUrls,
    addFiles: addImageFiles,
    removeAt: removeImageAt,
    pendingFiles,
    existingUploads,
  } = useAssetItemImages(assetItem?.uploads ?? []);

  const allStepsCompleted = React.useMemo(() => new Set(ASSET_CLASS_STEP_ORDER), []);

  const { control, setValue, handleSubmit } = useForm<AddAssetItemFormValues>({
    resolver: zodResolver(addAssetItemSchema) as unknown as Resolver<AddAssetItemFormValues>,
    defaultValues: buildDefaultValues(assetClass, assetItem),
    mode: "all",
  });

  const isOverrideEnabled = useWatch({
    control,
    name: "overrideParentClassConfigurations",
  });
  const colourVariants = useWatch({ control, name: "colourVariants" });

  const handleQuickAddSelect = (result: AssetQuickSearchResultType) => {
    setValue("name", result.name, { shouldDirty: true, shouldValidate: true });

    const marketPrice = parseCurrencyToNumber(result.market_price);
    if (marketPrice !== undefined) {
      setValue("price.value", marketPrice, { shouldDirty: true, shouldValidate: true });
    }

    const retailPrice = parseCurrencyToNumber(result.retail_price);
    if (retailPrice !== undefined) {
      setValue("retailPrice", retailPrice, { shouldDirty: true, shouldValidate: true });
    }
  };

  const buildPayload = (values: AddAssetItemFormValues) => ({
    ...buildAssetBasePayload(values),
    overrideParentClassConfigurations: values.overrideParentClassConfigurations,
    ...(values.overrideParentClassConfigurations
      ? {
          configuration: buildAssetConfigurationPayload(assetClass, values.name, values),
        }
      : {}),
  });

  const performUpdate = (values: AddAssetItemFormValues) => {
    if (!isEditMode) return;
    updateAsset(assetItem.assetId, buildPayload(values), pendingFiles, existingUploads, () =>
      setStage("SUCCESS"),
    );
  };

  const performDelete = () => {
    if (!isEditMode) return;
    deleteAsset(assetItem.assetId, () => onOpenChange(false));
  };

  const onSubmit = (values: AddAssetItemFormValues) => {
    if (isEditMode) {
      setPendingValues(values);
      setStage("CONFIRM_UPDATE");
      return;
    }
    createAsset(buildPayload(values), pendingFiles, () => setStage("SUCCESS"));
  };

  const isSaving = isEditMode ? loading.UPDATE_ASSET : loading.CREATE_ASSET;
  const modalTitle = "Asset Item Configuration";

  const stageConfig: Record<
    ModalStage,
    {
      contentClassName: string;
      closeOnBackdropClick: boolean;
      content: React.ReactNode;
    }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: "max-w-[1024px] p-4 sm:p-6",
      content: (
        // `space-y-*` puts a margin-top on every non-first child, including
        // the sticky Header/Footer — that margin stacks on top of the
        // padding those already carry for their sticky bleed, producing a
        // large blank gap right before the pinned footer (and interacting
        // oddly with the header's own negative-margin bleed). Sticky
        // Header/Footer stay outside any space-y/gap container; the normal
        // flowing content gets its own nested space-y-5 instead, with pt-5
        // standing in for the mt-5 the search field would otherwise have
        // gotten as the (no-longer-)second child.
        <div className="flex flex-col">
          <ModalShell.Header
            title={modalTitle}
            description="Manage and configure Asset Item"
            showBackButton
            onBack={() => onOpenChange(false)}
            sticky
          />

          <div className="space-y-5 pt-5">
            <QuickAddSearchField onSelect={handleQuickAddSelect} />

            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ModalShell.Body className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">Item Description</h3>
                  <AssetTypeBadge
                    label={
                      ASSET_TYPE_LABELS[assetClass.assetType] ?? toTitleCase(assetClass.assetType)
                    }
                  />
                  <AssetTypeBadge label={assetClass.name} />
                </div>

                <ImageUploadGrid
                  urls={imageUrls}
                  onAddFiles={addImageFiles}
                  onRemoveAt={removeImageAt}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <FormField control={control} name="name" label="Asset Name" required>
                    {({ field }) => (
                      <FormControl>
                        <Input {...field} placeholder="Enter text here" />
                      </FormControl>
                    )}
                  </FormField>

                  <FormField control={control} name="modelNumber" label="Model Number">
                    {({ field }) => (
                      <FormControl>
                        <Input {...field} placeholder="Enter text here" />
                      </FormControl>
                    )}
                  </FormField>

                  <FormField
                    control={control}
                    name="price.value"
                    label="Asset Market Value"
                    required
                  >
                    {({ field }) => (
                      <FormCurrencyInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="0.00"
                        startAdornment="$"
                      />
                    )}
                  </FormField>

                  <FormField control={control} name="retailPrice" label="Asset Retail Value">
                    {({ field }) => (
                      <FormCurrencyInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="0.00"
                        startAdornment="$"
                      />
                    )}
                  </FormField>

                  <FormField control={control} name="productionYear" label="Year of Release">
                    {({ field }) => (
                      <FormDatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        placeholder="DD/MM/YYYY"
                        displayFormat="dd/MM/yyyy"
                      />
                    )}
                  </FormField>

                  <FormField control={control} name="ownershipType" label="Ownership Type">
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormSelectTrigger>
                          <SelectValue placeholder="Select Options" />
                        </FormSelectTrigger>
                        <SelectContent>
                          {OWNERSHIP_TYPE_VALUES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField control={control} name="weight.unit" label="Asset Weight Class">
                    {({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormSelectTrigger>
                          <SelectValue />
                        </FormSelectTrigger>
                        <SelectContent>
                          {WEIGHT_UNIT_VALUES.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField control={control} name="weight.value" label="Asset Weight Value">
                    {({ field }) => (
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                    )}
                  </FormField>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-black">Asset Colour Variant(s)</p>
                  <ToggleGroup
                    selection="multiple"
                    look="pill"
                    value={colourVariants ?? []}
                    onValueChange={(next) =>
                      setValue("colourVariants", next, { shouldDirty: true })
                    }
                  >
                    {COLOUR_VARIANT_VALUES.map((colour) => (
                      <ToggleGroupItem key={colour} value={colour}>
                        {colour}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-primary-grey-stroke pt-4 sm:grid-cols-2">
                  <FormSwitchField
                    control={control}
                    name="isBoxed"
                    label="Box Available"
                    description="Item is sold with its original box"
                    size="sm"
                  />

                  <FormSwitchField
                    control={control}
                    name="hasPapers"
                    label="Certification Papers Available"
                    description="Item is sold with its original papers/documentation"
                    size="sm"
                  />
                </div>
              </ModalShell.Body>

              <FormSwitchField
                control={control}
                name="overrideParentClassConfigurations"
                label="Overwrite Parent Class Configurations"
                description="Customize configurations for this asset Item"
                size="sm"
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
          </div>

          <ModalShell.Footer sticky>
            {isEditMode ? (
              <ModalShell.Action
                type="button"
                className="bg-alertSoft-error text-alert-error hover:bg-alertSoft-error/80"
                onClick={() => setStage("CONFIRM_DELETE")}
              >
                Delete
              </ModalShell.Action>
            ) : (
              <ModalShell.Action
                type="button"
                variant="grey-stroke"
                onClick={() => onOpenChange(false)}
              >
                Close
              </ModalShell.Action>
            )}

            <ModalShell.Action type="submit" form={formId} pending={isSaving}>
              {isEditMode ? "Update" : "Create Asset"}
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
              pending={isSaving}
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
            <ModalShell.Action
              type="button"
              variant="danger"
              pending={loading.DELETE_ASSET}
              onClick={performDelete}
            >
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
