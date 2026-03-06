"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { ModalRoot, SuccessModal } from "@/components/modal";

type AddAssetModalProps = {
  triggerLabel?: string;
};

type AddAssetFormValues = {
  nameOfItem: string;
  priceAmount: string;
  assetBrand: string;
  assetCategory: string;
  condition: string;
  year: string;
  papers: string;
  box: string;
  caseColour: string;
  caseSize: string;
  weight: string;
  dialColour: string;
  saveAndPublish: boolean;
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

export function AddAssetModal({ triggerLabel = "Add New Asset" }: AddAssetModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<AddAssetFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const handleModalChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset(DEFAULT_VALUES);
    }
  };

  const handleSuccessChange = (open: boolean) => {
    setIsSuccessOpen(open);
  };

  const onSubmit = (values: AddAssetFormValues) => {
    console.log("Add asset payload", values);
    setIsOpen(false);
    setIsSuccessOpen(true);
    reset(DEFAULT_VALUES);
  };

  return (
    <>
      <ModalRoot
        open={isOpen}
        onOpenChange={handleModalChange}
        showCloseButton={false}
        trigger={<Button className="h-12 rounded-2xl px-5">{triggerLabel}</Button>}
        contentClassName="max-w-[1024px] p-4 sm:p-6"
      >
        <div className="space-y-5">
          <div className="border-b border-primary-grey-stroke pb-5">
            <div className="flex items-start gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-2xl border border-primary-grey-stroke bg-primary-white text-text-black hover:bg-primary-grey-undertone"
                onClick={() => handleModalChange(false)}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>

              <div>
                <h2 className="text-text-black text-4xl font-semibold leading-tight">
                  Asset Item Information
                </h2>
                <p className="text-text-black mt-1 text-lg">Upload and manage luxury asset item.</p>
              </div>
            </div>
          </div>

          <UploadShell />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-2xl bg-primary-white p-4 sm:p-6"
          >
            <h3 className="text-text-black text-3xl font-medium">Item Description</h3>

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

            <FormField
              control={control}
              name="saveAndPublish"
              orientation="horizontal"
              className="justify-end pt-2"
            >
              {({ field }) => (
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <span className="text-text-grey text-lg font-semibold">Save and Publish</span>
                </div>
              )}
            </FormField>

            <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                className="h-12 min-w-[220px] rounded-3xl border border-primary-grey-stroke bg-primary-grey-stroke text-lg text-text-black hover:bg-primary-grey-undertone"
                onClick={() => handleModalChange(false)}
              >
                Close
              </Button>
              <Button type="submit" className="h-12 min-w-[220px] rounded-3xl text-lg">
                Upload
              </Button>
            </div>
          </form>
        </div>
      </ModalRoot>

      <SuccessModal
        open={isSuccessOpen}
        onOpenChange={handleSuccessChange}
        title="Item added to Inventory"
        description="New luxury asset item has been added to asset inventory"
      />
    </>
  );
}
