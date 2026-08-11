"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField } from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  addAssetCategorySchema,
  type AddAssetCategoryFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import useAssetManagementFns from "@/services/functions/asset-management.fns";
import type {
  AssetCategoryStatus,
  AssetCategoryType,
  AssetClassType,
  CreateAssetClassPayloadType,
} from "@/types/asset-management.type";
import { mapAssetClassToConfigFormValues, resolveAssetConfig } from "@/util/resolve-asset-config";

type AssetCategoryConfigurationModalProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetCategory?: undefined;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetCategory: AssetCategoryType;
    };

type ModalStage = "FORM" | "SUCCESS";

function buildDefaultValues(
  assetClass: AssetClassType,
  assetCategory?: AssetCategoryType,
): AddAssetCategoryFormValues {
  const resolvedConfig = resolveAssetConfig(
    mapAssetClassToConfigFormValues(assetClass),
    undefined,
    assetCategory?.configuration ? mapAssetClassToConfigFormValues(assetCategory.configuration) : undefined,
  );

  return {
    categoryName: assetCategory?.name ?? "",
    status: assetCategory?.status ?? "published",
    overrideParentClassConfigurations: assetCategory?.overrideParentClassConfigurations ?? false,
    ...resolvedConfig,
  };
}

// The nested `configuration` payload is shaped exactly like the asset class's own
// POST body (assetType/name/status + the 8 config sections) — see the
// POST /v1/asset-categories curl sample with overrideParentClassConfigurations: true.
function buildCategoryConfigurationPayload(
  assetClass: AssetClassType,
  categoryName: string,
  values: AddAssetCategoryFormValues,
): Omit<CreateAssetClassPayloadType, "description"> {
  return {
    assetType: assetClass.assetType,
    name: categoryName.trim(),
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

export function AssetCategoryConfigurationModal(props: AssetCategoryConfigurationModalProps) {
  const { mode, open, onOpenChange, assetClass, assetCategory } = props;
  const isEditMode = mode === "edit";

  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const formId = React.useId();
  const { createAssetCategory, updateAssetCategory, loading } = useAssetManagementFns();

  // Every step is pre-populated from the resolved parent config, so unlike the
  // class wizard there's no progressive Next/Back gating here — every step is
  // already valid and reachable as soon as the override toggle is on.
  const allStepsCompleted = React.useMemo(() => new Set(ASSET_CLASS_STEP_ORDER), []);

  const { control, handleSubmit } = useForm<AddAssetCategoryFormValues>({
    // See matching comment in the asset class modal: zodResolver's inferred type
    // traces the schema's pre-coercion input shape, which structurally conflicts
    // with the post-coercion AddAssetCategoryFormValues type used everywhere else
    // in this form (and required by AssetClassConfigWizard's Control<T>).
    resolver: zodResolver(addAssetCategorySchema) as unknown as Resolver<AddAssetCategoryFormValues>,
    defaultValues: buildDefaultValues(assetClass, assetCategory),
    mode: "all",
  });

  const isOverrideEnabled = useWatch({ control, name: "overrideParentClassConfigurations" });

  const onSubmit = (values: AddAssetCategoryFormValues) => {
    const status = values.status as AssetCategoryStatus;

    if (isEditMode) {
      updateAssetCategory(
        assetCategory.reference,
        {
          name: values.categoryName.trim(),
          status,
          overrideParentClassConfigurations: values.overrideParentClassConfigurations,
          ...(values.overrideParentClassConfigurations
            ? {
                configuration: buildCategoryConfigurationPayload(
                  assetClass,
                  values.categoryName,
                  values,
                ),
              }
            : {}),
        },
        () => setStage("SUCCESS"),
      );
      return;
    }

    createAssetCategory(
      {
        name: values.categoryName.trim(),
        status,
        assetClassId: assetClass.classId,
        overrideParentClassConfigurations: values.overrideParentClassConfigurations,
        ...(values.overrideParentClassConfigurations
          ? {
              configuration: buildCategoryConfigurationPayload(
                assetClass,
                values.categoryName,
                values,
              ),
            }
          : {}),
      },
      () => setStage("SUCCESS"),
    );
  };

  const isSaving = isEditMode ? loading.UPDATE_ASSET_CATEGORY : loading.CREATE_ASSET_CATEGORY;
  const showWizard = isOverrideEnabled;

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: showWizard ? "max-w-[1024px] p-4 sm:p-6" : "max-w-[650px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Asset Category Configuration"
            description="Manage and configure Asset Category"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField control={control} name="categoryName" label="Asset Category Name" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <div className="space-y-1.5">
                  <FieldLabel>
                    Parent Class<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input value={assetClass.name} disabled readOnly />
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
                      <FieldDescription>Make this category visible/discoverable</FieldDescription>
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

              <FormField
                control={control}
                name="overrideParentClassConfigurations"
                className="border-t border-primary-grey-stroke pt-4"
              >
                {({ field }) => (
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">Overwrite Parent Class Configurations</Label>
                      <FieldDescription>
                        This will allow you manually customize configurations for this category
                      </FieldDescription>
                    </div>
                    <FormControl>
                      <Switch
                        size="sm"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </div>
                )}
              </FormField>

              {showWizard ? (
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
          title={isEditMode ? "Asset Category Updated" : "Asset Category Created"}
          description={
            isEditMode
              ? "This asset category's details have been updated successfully"
              : "New asset category has been added to asset inventory"
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
