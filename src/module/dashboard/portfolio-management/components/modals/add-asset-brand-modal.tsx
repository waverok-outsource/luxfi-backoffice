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

type AddAssetBrandModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEFAULT_VALUES: AddAssetBrandFormValues = {
  brandName: "",
  assetCategory: "",
  saveAndPublish: false,
};

const assetCategoryOptions = [
  { label: "Luxury Watches", value: "luxury-watches" },
  { label: "Designer Bags", value: "designer-bags" },
  { label: "Luxury Cars", value: "luxury-cars" },
];

type AddAssetBrandStage = "FORM" | "SUCCESS";

export function AddAssetBrandModal({ open, onOpenChange }: AddAssetBrandModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetBrandStage>("FORM");
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddAssetBrandFormValues>({
    resolver: zodResolver(addAssetBrandSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const onSubmit = (values: AddAssetBrandFormValues) => {
    console.log("Add asset brand payload", values);
    setCurrentStage("SUCCESS");
  };

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
            title="Add New Asset Brand"
            description="Fill details to add new brand type to asset inventory"
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Options" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {assetCategoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          title="New Brand Added"
          description="New luxury asset brand has been added to asset inventory"
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
