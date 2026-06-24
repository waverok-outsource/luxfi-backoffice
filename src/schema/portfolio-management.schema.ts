import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");
const numericText = requiredText.refine((value) => !Number.isNaN(Number(value)), "Invalid number");

const oneOf = <TAllowed extends readonly string[]>(allowed: TAllowed) =>
  requiredText.refine((value) => allowed.includes(value), "Invalid option");

const YES_NO_VALUES = ["yes", "no"] as const;

export const addAssetSchema = z.object({
  nameOfItem: requiredText,
  priceAmount: numericText,
  assetBrand: requiredText,
  assetCategory: requiredText,
  condition: z.string().trim(),
  year: requiredText,
  papers: oneOf(YES_NO_VALUES),
  box: oneOf(YES_NO_VALUES),
  caseColour: requiredText,
  caseSize: numericText,
  weight: numericText,
  dialColour: requiredText,
  saveAndPublish: z.boolean(),
});

export type AddAssetFormValues = z.infer<typeof addAssetSchema>;

export const addAssetBrandSchema = z.object({
  brandName: requiredText,
  assetCategory: requiredText,
  saveAndPublish: z.boolean(),
});

export type AddAssetBrandFormValues = z.infer<typeof addAssetBrandSchema>;

export const addAssetCategorySchema = z.object({
  categoryName: requiredText,
  saveAndPublish: z.boolean(),
});

export type AddAssetCategoryFormValues = z.infer<typeof addAssetCategorySchema>;
