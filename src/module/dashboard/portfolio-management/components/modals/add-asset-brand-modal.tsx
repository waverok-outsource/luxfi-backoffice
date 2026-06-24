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
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import {
  addAssetBrandSchema,
  type AddAssetBrandFormValues,
} from "@/schema/portfolio-management.schema";
import usePortfolioFns from "@/services/functions/portfolio.fns";
import { usePortfolioAssetCategories } from "@/services/queries/portfolio.queries";
import type {
  CreatePortfolioAssetBrandPayloadType,
  UpdatePortfolioAssetBrandPayloadType,
} from "@/types/portfolio.type";
import { toTitleCase } from "@/util/helper";

type AddAssetBrandModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  brand?: {
    brandId: string;
    brandName: string;
    categoryId: string;
    isPublished: boolean;
  };
};

const DEFAULT_VALUES: AddAssetBrandFormValues = {
  brandName: "",
  assetCategory: "",
  saveAndPublish: false,
};

type AddAssetBrandStage = "FORM" | "SUCCESS";
const CATEGORY_OPTIONS_QUERY = "page=1&limit=100";

function buildCreateAssetBrandPayload(
  values: AddAssetBrandFormValues,
): CreatePortfolioAssetBrandPayloadType {
  return {
    name: values.brandName.trim(),
    category: values.assetCategory.trim(),
  };
}

function buildUpdateAssetBrandPayload(
  values: AddAssetBrandFormValues,
): UpdatePortfolioAssetBrandPayloadType {
  return {
    name: values.brandName.trim(),
    category: values.assetCategory.trim(),
    status: values.saveAndPublish ? "published" : "draft",
  };
}

export function AddAssetBrandModal({
  open,
  onOpenChange,
  mode = "add",
  brand,
}: AddAssetBrandModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetBrandStage>("FORM");
  const formId = React.useId();
  const { createAssetBrand, updateAssetBrand, loading } = usePortfolioFns();
  const isEditMode = mode === "edit";
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    usePortfolioAssetCategories(CATEGORY_OPTIONS_QUERY);
  const categoryOptions = categoriesResponse?.data ?? [];
  const initialValues: AddAssetBrandFormValues =
    isEditMode && brand
      ? {
          brandName: brand.brandName,
          assetCategory: brand.categoryId,
          saveAndPublish: brand.isPublished,
        }
      : DEFAULT_VALUES;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddAssetBrandFormValues>({
    resolver: zodResolver(addAssetBrandSchema),
    defaultValues: initialValues,
    mode: "all",
  });

  const onSubmit = async (values: AddAssetBrandFormValues) => {
    if (isEditMode) {
      if (!brand?.brandId) {
        return;
      }

      const payload = buildUpdateAssetBrandPayload(values);
      await updateAssetBrand(brand.brandId, payload, () => setCurrentStage("SUCCESS"));
      return;
    }

    const payload = buildCreateAssetBrandPayload(values);
    await createAssetBrand(payload, () => setCurrentStage("SUCCESS"));
  };

  const modalCopy = isEditMode
    ? {
        title: "Edit Asset Brand",
        description: "Fill details of brand type to asset inventory",
        submitLabel: "Save Changes",
      }
    : {
        title: "Add New Asset Brand",
        description: "Fill details to add new brand type to asset inventory",
        submitLabel: "Confirm",
      };

  const successCopy = isEditMode
    ? {
        title: "Brand Updated",
        description: "Asset brand details have been updated successfully.",
      }
    : {
        title: "New Brand Added",
        description: "New luxury asset brand has been added to asset inventory",
      };

  const isSaving = loading.CREATE_ASSET_BRAND || loading.UPDATE_ASSET_BRAND;
  const isSubmitDisabled = !isValid || isSaving || (isEditMode && !brand?.brandId);

  const stageConfig: Record<
    AddAssetBrandStage,
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
                <FormField control={control} name="brandName" label="Brand Name" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter text here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="assetCategory" label="Asset Category" required>
                  {({ field }) => (
                    <div className="space-y-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isCategoriesLoading || categoryOptions.length === 0}
                      >
                        <FormSelectTrigger>
                          <SelectValue>
                            {(selectedCategoryId: string | null) => {
                              if (!selectedCategoryId) {
                                return isCategoriesLoading
                                  ? "Loading categories..."
                                  : "Select category";
                              }

                              const selected = categoryOptions.find(
                                (category) => category.categoryId === selectedCategoryId,
                              );
                              return selected ? toTitleCase(selected.name) : "Select category";
                            }}
                          </SelectValue>
                        </FormSelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.categoryId} value={category.categoryId}>
                              {toTitleCase(category.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!isCategoriesLoading && categoryOptions.length === 0 ? (
                        <p className="text-sm text-text-grey">No categories available.</p>
                      ) : null}
                    </div>
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
