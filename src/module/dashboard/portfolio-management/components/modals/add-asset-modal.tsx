"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import { addAssetSchema, type AddAssetFormValues } from "@/schema/portfolio-management.schema";

type AddAssetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEFAULT_VALUES: AddAssetFormValues = {
  nameOfItem: "",
  priceAmount: "",
  assetBrand: "",
  assetCategory: "",
  condition: "",
  year: "",
  papers: "",
  box: "",
  caseColour: "",
  caseSize: "",
  weight: "",
  dialColour: "",
  saveAndPublish: false,
};

const assetCategoryOptions = [
  { label: "Luxury Watches", value: "luxury-watches" },
  { label: "Designer Bags", value: "designer-bags" },
  { label: "Luxury Cars", value: "luxury-cars" },
];

const yearOptions = [
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
];

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const uploadSlots = Array.from({ length: 5 }, (_, index) => index + 1);

type AddAssetStage = "FORM" | "SUCCESS";

function UploadShell() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {uploadSlots.map((slot) => (
        <Button
          key={slot}
          type="button"
          variant="ghost"
          className="h-[176px] rounded-2xl border border-primary-grey-stroke bg-primary-white p-0 hover:bg-primary-white sm:h-[192px]"
          aria-label={`Upload asset image ${slot}`}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone)),linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone))] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
            <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-grey-stroke bg-primary-grey-undertone text-text-grey">
              <Plus className="h-4 w-4" />
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}

export function AddAssetModal({ open, onOpenChange }: AddAssetModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetStage>("FORM");
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const onSubmit = (values: AddAssetFormValues) => {
    console.log("Add asset payload", values);
    setCurrentStage("SUCCESS");
  };

  const stageConfig: Record<
    AddAssetStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: false,
      contentClassName: "max-w-[1024px] p-4 sm:p-6",
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title="Asset Item Information"
            description="Upload and manage luxury asset item."
            showBackButton
            onBack={() => onOpenChange(false)}
          />

          <UploadShell />

          <ModalShell.Body>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="font-semibold">Item Description</h3>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <FormField control={control} name="nameOfItem" label="Name of Item" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="priceAmount" label="Price Amount" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="0.00" startAdornment="$" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="assetBrand" label="Asset Brand" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
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

                <FormField control={control} name="condition" label="Condition" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
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
                        {yearOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="papers" label="Papers" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Options" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="box" label="Box" required>
                  {({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormSelectTrigger>
                        <SelectValue placeholder="Select Options" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>

                <FormField control={control} name="caseColour" label="Case Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="caseSize" label="Case Size" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="weight" label="Weight" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
                    </FormControl>
                  )}
                </FormField>

                <FormField control={control} name="dialColour" label="Dial Colour" required>
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Enter here" />
                    </FormControl>
                  )}
                </FormField>
              </div>

              <FormSwitchField
                control={control}
                name="saveAndPublish"
                orientation="horizontal"
                className="pt-2"
                contentClassName="ml-auto"
                size="sm"
                label="Save and Publish"
              />
            </form>
          </ModalShell.Body>

          <ModalShell.Footer>
            <ModalShell.Action
              type="button"
              variant="grey-stroke"
              onClick={() => onOpenChange(false)}
            >
              Close
            </ModalShell.Action>
            <ModalShell.Action type="submit" form={formId} disabled={!isValid}>
              Upload
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
          title="Item added to Inventory"
          description="New luxury asset item has been added to asset inventory"
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
