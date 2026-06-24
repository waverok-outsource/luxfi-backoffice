"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import {
  addAssetCategorySchema,
  type AddAssetCategoryFormValues,
} from "@/schema/portfolio-management.schema";
import usePortfolioFns from "@/services/functions/portfolio.fns";
import type {
  CreatePortfolioAssetCategoryPayloadType,
  UpdatePortfolioAssetCategoryPayloadType,
} from "@/types/portfolio.type";

type AddAssetCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  category?: {
    categoryId: string;
    categoryName: string;
    originalCategoryName: string;
    isPublished: boolean;
  };
};

const DEFAULT_VALUES: AddAssetCategoryFormValues = {
  categoryName: "",
  saveAndPublish: false,
};

type AddAssetCategoryStage = "FORM" | "SUCCESS";

function buildCreateAssetCategoryPayload(
  values: AddAssetCategoryFormValues,
): CreatePortfolioAssetCategoryPayloadType {
  return {
    name: values.categoryName.trim(),
    status: values.saveAndPublish ? "published" : "draft",
  };
}

function buildUpdateAssetCategoryPayload(
  values: AddAssetCategoryFormValues,
  originalCategoryName: string,
): UpdatePortfolioAssetCategoryPayloadType {
  const nextName = values.categoryName.trim();
  const initialName = originalCategoryName.trim();
  const hasNameChanged = nextName.toLowerCase() !== initialName.toLowerCase();

  return {
    status: values.saveAndPublish ? "published" : "draft",
    ...(hasNameChanged ? { name: nextName } : {}),
  };
}

export function AddAssetCategoryModal({
  open,
  onOpenChange,
  mode = "add",
  category,
}: AddAssetCategoryModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetCategoryStage>("FORM");
  const formId = React.useId();
  const { createAssetCategory, updateAssetCategory, loading } = usePortfolioFns();
  const isEditMode = mode === "edit";
  const initialValues: AddAssetCategoryFormValues =
    isEditMode && category
      ? {
          categoryName: category.categoryName,
          saveAndPublish: category.isPublished,
        }
      : DEFAULT_VALUES;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddAssetCategoryFormValues>({
    resolver: zodResolver(addAssetCategorySchema),
    defaultValues: initialValues,
    mode: "all",
  });

  const onSubmit = async (values: AddAssetCategoryFormValues) => {
    if (isEditMode) {
      if (!category?.categoryId) {
        return;
      }

      const payload = buildUpdateAssetCategoryPayload(values, category.originalCategoryName);
      await updateAssetCategory(category.categoryId, payload, () => setCurrentStage("SUCCESS"));
      return;
    }

    const payload = buildCreateAssetCategoryPayload(values);
    await createAssetCategory(payload, () => setCurrentStage("SUCCESS"));
  };

  const modalCopy = isEditMode
    ? {
        title: "Edit Asset Category",
        description: "Fill details to edit category to asset inventory",
        submitLabel: "Save Changes",
      }
    : {
        title: "Add New Asset Category",
        description: "Fill details to add new category to asset inventory",
        submitLabel: "Confirm",
      };

  const successCopy = isEditMode
    ? {
        title: "Category Updated",
        description: "Asset category details have been updated successfully.",
      }
    : {
        title: "New Category Added",
        description: "New luxury asset category has been added to asset inventory",
      };

  const isSaving = loading.CREATE_ASSET_CATEGORY || loading.UPDATE_ASSET_CATEGORY;
  const isSubmitDisabled = !isValid || isSaving || (isEditMode && !category?.categoryId);

  const stageConfig: Record<
    AddAssetCategoryStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: false,
      contentClassName: "max-w-[563px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title={modalCopy.title}
            description={modalCopy.description}
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField control={control} name="categoryName" label="Category Name" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormSwitchField
                  control={control}
                  name="saveAndPublish"
                  orientation="horizontal"
                  className="pt-2"
                  size="sm"
                  label="Save and Publish"
                />
              </div>
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            {!isEditMode ? (
              <ModalShell.Action
                type="button"
                variant="grey-stroke"
                onClick={() => onOpenChange(false)}
              >
                Back
              </ModalShell.Action>
            ) : null}
            <ModalShell.Action
              type="submit"
              form={formId}
              disabled={isSubmitDisabled}
              pending={isSaving}
            >
              {modalCopy.submitLabel}
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
          title={successCopy.title}
          description={successCopy.description}
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[currentStage];

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
