import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");

const oneOf = <TAllowed extends readonly string[]>(allowed: TAllowed) =>
  requiredText.refine((value) => allowed.includes(value), "Invalid option");

const ASSET_CATEGORY_VALUES = ["luxury-watches", "designer-bags", "luxury-cars"] as const;
const YEAR_VALUES = ["2026", "2025", "2024", "2023"] as const;
const YES_NO_VALUES = ["yes", "no"] as const;

export const addAssetSchema = z.object({
  nameOfItem: requiredText,
  priceAmount: requiredText,
  assetBrand: requiredText,
  assetCategory: oneOf(ASSET_CATEGORY_VALUES),
  condition: requiredText,
  year: oneOf(YEAR_VALUES),
  papers: oneOf(YES_NO_VALUES),
  box: oneOf(YES_NO_VALUES),
  caseColour: requiredText,
  caseSize: requiredText,
  weight: requiredText,
  dialColour: requiredText,
  saveAndPublish: z.boolean(),
});

export type AddAssetFormValues = z.infer<typeof addAssetSchema>;

export const addAssetBrandSchema = z.object({
  brandName: requiredText,
  assetCategory: oneOf(ASSET_CATEGORY_VALUES),
  saveAndPublish: z.boolean(),
});

export type AddAssetBrandFormValues = z.infer<typeof addAssetBrandSchema>;

export const addAssetCategorySchema = z.object({
  categoryName: requiredText,
  saveAndPublish: z.boolean(),
});

export type AddAssetCategoryFormValues = z.infer<typeof addAssetCategorySchema>;
