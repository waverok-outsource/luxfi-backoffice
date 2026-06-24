"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import Image from "next/image";
import { Plus, X } from "lucide-react";
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
import usePortfolioFns from "@/services/functions/portfolio.fns";
import {
  usePortfolioAssetBrands,
  usePortfolioAssetCategories,
} from "@/services/queries/portfolio.queries";
import type { CreatePortfolioAssetPayloadType } from "@/types/portfolio.type";
import { toTitleCase } from "@/util/helper";

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

const MAX_UPLOAD_FILES = 5;
const BRAND_OPTIONS_QUERY = "page=1&limit=100";
const CATEGORY_OPTIONS_QUERY = "page=1&limit=100";
const YES_NO_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, index) => {
  const value = String(new Date().getFullYear() - index);
  return { label: value, value };
});

type AddAssetStage = "FORM" | "SUCCESS";

function parseNumericValue(value: string) {
  return Number(value.replace(/,/g, "").trim());
}

function buildCreateAssetPayload(values: AddAssetFormValues): CreatePortfolioAssetPayloadType {
  return {
    name: values.nameOfItem.trim(),
    status: values.saveAndPublish ? "published" : "draft",
    brand: values.assetBrand.trim(),
    category: values.assetCategory.trim(),
    condition: values.condition.trim(),
    productionYear: values.year.trim(),
    price: parseNumericValue(values.priceAmount),
    currencyCode: "USD",
    hasPapers: values.papers === "yes",
    isBoxed: values.box === "yes",
    caseColour: values.caseColour.trim(),
    caseSize: parseNumericValue(values.caseSize),
    weight: parseNumericValue(values.weight),
    dialColour: values.dialColour.trim(),
  };
}

function fileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function UploadShell({
  selectedFiles,
  onAddFiles,
  onRemoveFile,
}: {
  selectedFiles: File[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const previews = React.useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const openFilePicker = () => {
    if (selectedFiles.length >= MAX_UPLOAD_FILES) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          onAddFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: MAX_UPLOAD_FILES }, (_, index) => {
          const preview = previews[index];

          if (!preview) {
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                className="h-[176px] rounded-2xl border border-primary-grey-stroke bg-primary-white p-0 hover:bg-primary-white sm:h-[192px]"
                aria-label={`Upload asset image ${index + 1}`}
                onClick={openFilePicker}
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone)),linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone))] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
                  <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-grey-stroke bg-primary-grey-undertone text-text-grey">
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </Button>
            );
          }

          return (
            <div
              key={fileSignature(preview.file)}
              className="relative h-[176px] overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-white sm:h-[192px]"
            >
              <Image
                src={preview.url}
                alt={preview.file.name}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-black/70 text-primary-white transition hover:bg-primary-black"
                aria-label={`Remove ${preview.file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-text-grey">
        {selectedFiles.length} of {MAX_UPLOAD_FILES} images selected
      </p>
    </div>
  );
}

export function AddAssetModal({ open, onOpenChange }: AddAssetModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddAssetStage>("FORM");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const formId = React.useId();
  const { createAsset, loading } = usePortfolioFns();
  const isSaving = loading.CREATE_ASSET;

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    usePortfolioAssetCategories(CATEGORY_OPTIONS_QUERY);
  const categoryData = categoriesResponse?.data;
  const categoryOptions = React.useMemo(() => categoryData ?? [], [categoryData]);

  const { data: brandsResponse, isLoading: isBrandsLoading } = usePortfolioAssetBrands(BRAND_OPTIONS_QUERY);
  const brandData = brandsResponse?.data;
  const brandOptions = React.useMemo(() => brandData ?? [], [brandData]);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const selectedCategoryId = useWatch({ control, name: "assetCategory" });
  const filteredBrandOptions = React.useMemo(
    () =>
      selectedCategoryId
        ? brandOptions.filter((brand) => brand.categoryId === selectedCategoryId)
        : brandOptions,
    [brandOptions, selectedCategoryId],
  );

  const onAddFiles = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    setSelectedFiles((previousFiles) => {
      const previousSignatures = new Set(previousFiles.map(fileSignature));
      const availableSlots = Math.max(MAX_UPLOAD_FILES - previousFiles.length, 0);

      if (!availableSlots) {
        return previousFiles;
      }

      const nextFiles = Array.from(fileList)
        .filter((file) => !previousSignatures.has(fileSignature(file)))
        .slice(0, availableSlots);

      return [...previousFiles, ...nextFiles];
    });
  };

  const onRemoveFile = (index: number) => {
    setSelectedFiles((previousFiles) => previousFiles.filter((_, fileIndex) => fileIndex !== index));
  };

  const onSubmit = async (values: AddAssetFormValues) => {
    if (!selectedFiles.length) {
      return;
    }

    const payload = buildCreateAssetPayload(values);
    await createAsset(payload, selectedFiles, () => {
      setCurrentStage("SUCCESS");
    });
  };

  const isSubmitDisabled = !isValid || isSaving || selectedFiles.length === 0;

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

          <UploadShell
            selectedFiles={selectedFiles}
            onAddFiles={onAddFiles}
            onRemoveFile={onRemoveFile}
          />

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

                <FormField control={control} name="assetCategory" label="Asset Category" required>
                  {({ field }) => (
                    <div className="space-y-2">
                      <Select
                        value={field.value}
                        onValueChange={(categoryId) => {
                          field.onChange(categoryId);

                          const selectedBrandId = getValues("assetBrand");
                          const isSelectedBrandValid = brandOptions.some(
                            (brand) =>
                              brand.brandId === selectedBrandId && brand.categoryId === categoryId,
                          );

                          if (!isSelectedBrandValid) {
                            setValue("assetBrand", "", { shouldDirty: true, shouldValidate: true });
                          }
                        }}
                        disabled={isCategoriesLoading || categoryOptions.length === 0}
                      >
                        <FormSelectTrigger>
                          <SelectValue>
                            {(selectedId: string | null) => {
                              if (!selectedId) {
                                return isCategoriesLoading
                                  ? "Loading categories..."
                                  : "Select category";
                              }

                              const selectedCategory = categoryOptions.find(
                                (category) => category.categoryId === selectedId,
                              );
                              return selectedCategory
                                ? toTitleCase(selectedCategory.name)
                                : "Select category";
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
                    </div>
                  )}
                </FormField>

                <FormField control={control} name="assetBrand" label="Asset Brand" required>
                  {({ field }) => (
                    <div className="space-y-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          !selectedCategoryId || isBrandsLoading || filteredBrandOptions.length === 0
                        }
                      >
                        <FormSelectTrigger>
                          <SelectValue>
                            {(selectedId: string | null) => {
                              if (!selectedId) {
                                if (!selectedCategoryId) {
                                  return "Select category first";
                                }

                                return isBrandsLoading ? "Loading brands..." : "Select brand";
                              }

                              const selectedBrand = brandOptions.find(
                                (brand) => brand.brandId === selectedId,
                              );
                              return selectedBrand ? toTitleCase(selectedBrand.name) : "Select brand";
                            }}
                          </SelectValue>
                        </FormSelectTrigger>
                        <SelectContent>
                          {filteredBrandOptions.map((brand) => (
                            <SelectItem key={brand.brandId} value={brand.brandId}>
                              {toTitleCase(brand.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!isBrandsLoading && selectedCategoryId && filteredBrandOptions.length === 0 ? (
                        <p className="text-sm text-text-grey">
                          No brands available for the selected category.
                        </p>
                      ) : null}
                    </div>
                  )}
                </FormField>

                <FormField control={control} name="condition" label="Condition">
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
                        <SelectValue placeholder="Select year" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((option) => (
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
                        <SelectValue placeholder="Select option" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
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
                        <SelectValue placeholder="Select option" />
                      </FormSelectTrigger>
                      <SelectContent>
                        {YES_NO_OPTIONS.map((option) => (
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
            <ModalShell.Action
              type="submit"
              form={formId}
              disabled={isSubmitDisabled}
              pending={isSaving}
            >
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
