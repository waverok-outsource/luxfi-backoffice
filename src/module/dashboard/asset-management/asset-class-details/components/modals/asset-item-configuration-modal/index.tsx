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
  CASE_UNIT_VALUES,
  CURRENCY_VALUES,
  WEIGHT_UNIT_VALUES,
  type AddAssetItemFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import { useAssetCategories } from "@/services/queries/asset-management.queries";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import type {
  AssetClassType,
  AssetItemType,
  AssetQuickSearchResultType,
  CreateAssetClassPayloadType,
} from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { mapAssetClassToConfigFormValues, resolveAssetConfig } from "@/util/resolve-asset-config";

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

const CURRENT_YEAR = 2026;
const YEAR_OPTIONS = Array.from({ length: 15 }, (_, index) => String(CURRENT_YEAR - index));

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
    assetCategoryId: assetItem?.assetCategoryId ?? "",
    price: assetItem?.price ?? { value: 0, currencyCode: CURRENCY_VALUES[0] },
    productionYear: assetItem?.productionYear ?? "",
    hasPapers: assetItem?.hasPapers ?? false,
    isBoxed: assetItem?.isBoxed ?? false,
    case: assetItem?.case ?? { colour: "", size: 0, unit: CASE_UNIT_VALUES[0] },
    weight: assetItem?.weight ?? { value: 0, unit: WEIGHT_UNIT_VALUES[0] },
    dialColour: assetItem?.dialColour ?? "",
    overrideParentClassConfigurations: assetItem?.overrideParentClassConfigurations ?? false,
    ...resolvedConfig,
  };
}

function buildAssetBasePayload(values: AddAssetItemFormValues) {
  return {
    name: values.name.trim(),
    assetCategoryId: values.assetCategoryId,
    price: values.price,
    productionYear: values.productionYear,
    hasPapers: values.hasPapers,
    isBoxed: values.isBoxed,
    case: values.case,
    weight: values.weight,
    dialColour: values.dialColour,
  };
}

// Mirrors buildCategoryConfigurationPayload in the category modal — the
// nested `configuration` payload is shaped like the asset class's own POST
// body. NOT part of the sample POST /v1/assets body we were given; sent by
// assumption per docs/STATUS.md.
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
  const { data: categoriesResponse } = useAssetCategories(
    convertObjectToQuery({ assetClassId: assetClass.assetClassId }),
  );
  const categories = categoriesResponse?.data ?? [];

  const {
    urls: imageUrls,
    addFiles: addImageFiles,
    removeAt: removeImageAt,
    pendingFiles,
    existingUploads,
  } = useAssetItemImages(assetItem?.uploads ?? []);

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

  const isOverrideEnabled = useWatch({ control, name: "overrideParentClassConfigurations" });

  const handleQuickAddSelect = (result: AssetQuickSearchResultType) => {
    // The quick-search response only carries id/slug/name/prices/url — no
    // brand/year/case/weight/dial-colour to autofill the rest of the form
    // with. See docs/STATUS.md.
    setValue("name", result.name, { shouldDirty: true, shouldValidate: true });
  };

  const buildPayload = (values: AddAssetItemFormValues) => ({
    ...buildAssetBasePayload(values),
    overrideParentClassConfigurations: values.overrideParentClassConfigurations,
    ...(values.overrideParentClassConfigurations
      ? { configuration: buildAssetConfigurationPayload(assetClass, values.name, values) }
      : {}),
  });

  const performUpdate = (values: AddAssetItemFormValues) => {
    if (!isEditMode) {
      return;
    }

    updateAsset(
      assetItem.assetId,
      buildPayload(values),
      pendingFiles,
      existingUploads,
      () => setStage("SUCCESS"),
    );
  };

  const performDelete = () => {
    if (!isEditMode) {
      return;
    }

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
                <FormField control={control} name="name" label="Name of Item" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="assetCategoryId" label="Asset Category" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.reference} value={category.reference}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="productionYear" label="Production Year" required>
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

                <FormField control={control} name="dialColour" label="Dial Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="case.colour" label="Case Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="case.size" label="Case Size" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter number here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="case.unit" label="Case Size Unit" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Unit" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {CASE_UNIT_VALUES.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="weight.value" label="Weight" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter number here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="weight.unit" label="Weight Unit" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Unit" />
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

                <FormField control={control} name="price.value" label="Price" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter number here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="price.currencyCode" label="Currency" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {CURRENCY_VALUES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-primary-grey-stroke pt-4 sm:grid-cols-2">
                <FormSwitchField
                  control={control}
                  name="hasPapers"
                  label="Has Papers"
                  description="Item is sold with its original papers/documentation"
                  size="sm"
                />

                <FormSwitchField
                  control={control}
                  name="isBoxed"
                  label="Is Boxed"
                  description="Item is sold with its original box"
                  size="sm"
                />
              </div>

              <FormSwitchField
                control={control}
                name="overrideParentClassConfigurations"
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

            <ModalShell.Action type="submit" form={formId} pending={isSaving}>
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
