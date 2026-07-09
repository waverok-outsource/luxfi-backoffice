"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import { AssetClassConfigWizard } from "@/module/dashboard/asset-management/components/asset-class-config-wizard";
import { ASSET_CLASS_STEP_ORDER } from "@/module/dashboard/asset-management/components/asset-class-step-meta";
import {
  addAssetCategorySchema,
  type AddAssetCategoryFormValues,
  type AssetClassStepKey,
} from "@/schema/asset-management.schema";
import type { AssetCategoryType, AssetClassType } from "@/types/asset-management.type";
import { resolveAssetConfig } from "@/util/resolve-asset-config";

type AssetCategoryConfigurationModalProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetCategory?: undefined;
      onAssetCategoryCreated?: (category: AssetCategoryType) => void;
      onAssetCategoryUpdated?: never;
      onAssetCategoryDeleted?: never;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      assetClass: AssetClassType;
      assetCategory: AssetCategoryType;
      onAssetCategoryCreated?: never;
      onAssetCategoryUpdated?: (assetCategoryId: string, patch: Partial<AssetCategoryType>) => void;
      onAssetCategoryDeleted?: (assetCategoryId: string) => void;
    };

type ModalStage = "FORM" | "CONFIRM_UPDATE" | "CONFIRM_DELETE" | "SUCCESS";

function buildDefaultValues(
  assetClass: AssetClassType,
  assetCategory?: AssetCategoryType,
): AddAssetCategoryFormValues {
  const resolvedConfig = resolveAssetConfig(
    assetClass.config,
    undefined,
    assetCategory?.categoryConfig,
  );

  return {
    categoryName: assetCategory?.name ?? "",
    overwriteParentClassConfigurations: assetCategory?.overwriteParentClassConfigurations ?? false,
    ...resolvedConfig,
  };
}

function splitCategoryFormValues(values: AddAssetCategoryFormValues) {
  const { categoryName, overwriteParentClassConfigurations, ...config } = values;

  return { categoryName, overwriteParentClassConfigurations, config };
}

function buildAssetCategoryPatch(
  values: AddAssetCategoryFormValues,
): Omit<AssetCategoryType, "assetCategoryId" | "assetClassId" | "listingStatus" | "createdAt"> {
  const { categoryName, overwriteParentClassConfigurations, config } =
    splitCategoryFormValues(values);

  return {
    name: categoryName.trim(),
    overwriteParentClassConfigurations,
    categoryConfig: overwriteParentClassConfigurations ? config : undefined,
  };
}

function buildAssetCategory(
  assetClassId: string,
  values: AddAssetCategoryFormValues,
): AssetCategoryType {
  return {
    assetCategoryId: `AC-CAT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    assetClassId,
    listingStatus: "unlisted",
    createdAt: new Date().toISOString(),
    ...buildAssetCategoryPatch(values),
  };
}

export function AssetCategoryConfigurationModal(props: AssetCategoryConfigurationModalProps) {
  const { mode, open, onOpenChange, assetClass, assetCategory } = props;
  const isEditMode = mode === "edit";

  const [stage, setStage] = React.useState<ModalStage>("FORM");
  const [activeStep, setActiveStep] = React.useState<AssetClassStepKey>(ASSET_CLASS_STEP_ORDER[0]);
  const [pendingValues, setPendingValues] = React.useState<AddAssetCategoryFormValues | null>(null);
  const formId = React.useId();

  // Every step is pre-populated from the resolved parent config, so unlike the
  // class wizard there's no progressive Next/Back gating here — every step is
  // already valid and reachable as soon as the override toggle is on.
  const allStepsCompleted = React.useMemo(() => new Set(ASSET_CLASS_STEP_ORDER), []);

  const { control, handleSubmit } = useForm<AddAssetCategoryFormValues>({
    resolver: zodResolver(addAssetCategorySchema),
    defaultValues: buildDefaultValues(assetClass, assetCategory),
    mode: "all",
  });

  const isOverrideEnabled = useWatch({ control, name: "overwriteParentClassConfigurations" });

  const performUpdate = (values: AddAssetCategoryFormValues) => {
    if (!isEditMode) {
      return;
    }

    props.onAssetCategoryUpdated?.(assetCategory.assetCategoryId, buildAssetCategoryPatch(values));
    setStage("SUCCESS");
  };

  const performDelete = () => {
    if (!isEditMode) {
      return;
    }

    props.onAssetCategoryDeleted?.(assetCategory.assetCategoryId);
    onOpenChange(false);
  };

  const onSubmit = (values: AddAssetCategoryFormValues) => {
    if (isEditMode) {
      setPendingValues(values);
      setStage("CONFIRM_UPDATE");
      return;
    }

    props.onAssetCategoryCreated?.(buildAssetCategory(assetClass.assetClassId, values));
    setStage("SUCCESS");
  };

  const modalTitle = "Asset Category Configuration";

  const stageConfig: Record<
    ModalStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: true,
      contentClassName: isOverrideEnabled ? "max-w-[1024px] p-4 sm:p-6" : "max-w-[650px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title={modalTitle}
            description="Manage and configure Asset Category"
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="categoryName"
                  label="Asset Category Name"
                  required
                >
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

              <FormSwitchField
                control={control}
                name="overwriteParentClassConfigurations"
                label="Overwrite Parent Class Configurations"
                description="This will allow you manually customize configurations for this asset item"
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
              <ModalShell.Action
                type="button"
                variant="grey-stroke"
                onClick={() => onOpenChange(false)}
              >
                Close
              </ModalShell.Action>
            )}

            <ModalShell.Action type="submit" form={formId}>
              {isEditMode ? "Update" : "Save"}
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
            title="Update Asset Category?"
            description="You are about to save changes to this asset category details"
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
            title="Delete Asset Category?"
            description="You are about to permanently remove this asset category from the inventory."
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
