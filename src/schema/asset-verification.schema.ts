import { z } from "zod";

const requiredText = (message: string) => z.string().trim().min(1, message);

export const ASSET_VERIFICATION_STATUS_VALUES = ["pending", "verified", "rejected", "notVerified"] as const;

export const assetVerificationFormSchema = z
  .object({
    targetStatus: z.enum(ASSET_VERIFICATION_STATUS_VALUES),
    loanOfferAmount: z
      .string()
      .trim()
      .refine((value) => value === "" || !Number.isNaN(Number(value)), "Enter a valid amount"),
    submittedDate: z.date().optional(),
    examinationDate: z.date().optional(),
    officerEmail: z.string().trim(),
    remarks: z.string(),
    certificationPapersAvailable: z.boolean().nullable(),
    boxPackaged: z.boolean().nullable(),
    preOwned: z.boolean().nullable(),
    anyPhysicalDefects: z.boolean().nullable(),
    proofFileName: z.string().optional(),
    rejectionReason: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.targetStatus === "verified") {
      if (!values.submittedDate) {
        ctx.addIssue({ code: "custom", path: ["submittedDate"], message: "Submitted date is required" });
      }
      if (!values.examinationDate) {
        ctx.addIssue({ code: "custom", path: ["examinationDate"], message: "Examination date is required" });
      }
      if (!values.officerEmail.trim()) {
        ctx.addIssue({ code: "custom", path: ["officerEmail"], message: "Officer is required" });
      }
      if (values.certificationPapersAvailable !== true) {
        ctx.addIssue({
          code: "custom",
          path: ["certificationPapersAvailable"],
          message: "Certification papers must be confirmed",
        });
      }
      if (values.boxPackaged !== true) {
        ctx.addIssue({ code: "custom", path: ["boxPackaged"], message: "Box-packaged must be confirmed" });
      }
    }

    if (values.targetStatus === "rejected" && !values.rejectionReason?.trim()) {
      ctx.addIssue({ code: "custom", path: ["rejectionReason"], message: "Reason for rejection is required" });
    }
  });

export type AssetVerificationFormValues = z.infer<typeof assetVerificationFormSchema>;
export type AssetVerificationFormInputValues = z.input<typeof assetVerificationFormSchema>;

export const blacklistAssetSchema = z.object({
  reason: requiredText("Select a reason"),
  notice: requiredText("Enter a compliance notice"),
});

export type BlacklistAssetFormValues = z.infer<typeof blacklistAssetSchema>;
