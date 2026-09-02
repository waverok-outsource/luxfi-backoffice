import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");
const numericText = requiredText.refine(
  (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
  "Enter a valid amount",
);
export const addToMarketplaceSchema = z.object({
  unitListingPrice: numericText,
  quantity: numericText,
  boxPackaged: z.boolean(),
  certificationPapersAvailable: z.boolean(),
  additionalInformation: z.string().optional(),
});

export type AddToMarketplaceFormValues = z.infer<typeof addToMarketplaceSchema>;

export const rejectOfferSchema = z.object({
  rejectionReason: requiredText,
});

export type RejectOfferFormValues = z.infer<typeof rejectOfferSchema>;
