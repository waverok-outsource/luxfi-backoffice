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

type AddAssetCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEFAULT_VALUES: AddAssetCategoryFormValues = {
  categoryName: "",
  saveAndPublish: false,
};

type AddAssetCategoryStage = "FORM" | "SUCCESS";

export function AddAssetCategoryModal({ open, onOpenChange }: AddAssetCategoryModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetCategoryStage>("FORM");
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddAssetCategoryFormValues>({
    resolver: zodResolver(addAssetCategorySchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const onSubmit = (values: AddAssetCategoryFormValues) => {
    console.log("Add asset category payload", values);
    setCurrentStage("SUCCESS");
  };

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
            title="Add New Asset Category"
            description="Fill details to add new category to asset inventory"
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
            <ModalShell.Action
              type="button"
              variant="grey-stroke"
              onClick={() => onOpenChange(false)}
            >
              Back
            </ModalShell.Action>
            <ModalShell.Action type="submit" form={formId} disabled={!isValid}>
              Confirm
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
          title="New Category Added"
          description="New luxury asset category has been added to asset inventory"
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
