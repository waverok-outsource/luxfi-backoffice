import { z } from "zod";

export const blacklistCustomerSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  notice: z.string().min(3, "Enter a compliance notice"),
});

export type BlacklistCustomerFormValues = z.infer<typeof blacklistCustomerSchema>;

const requiredText = (message: string) => z.string().trim().min(1, message);

export const assetPortfolioInfoSchema = z.object({
  pawnValue: requiredText("Pawn value is required").refine(
    (value) => !Number.isNaN(Number(value)),
    "Enter a valid pawn value",
  ),
  submittedDate: z
    .date()
    .optional()
    .refine((value) => value !== undefined, "Submitted date is required"),
  examinationDate: z
    .date()
    .optional()
    .refine((value) => value !== undefined, "Examination date is required"),
  officerEmail: requiredText("Officer is required"),
  physicalDefects: z.string(),
  officerRemark: requiredText("Remark is required"),
  certificationPapers: z
    .boolean()
    .nullable()
    .refine((value) => value !== null, "Certification Papers is required"),
  boxPackaged: z
    .boolean()
    .nullable()
    .refine((value) => value !== null, "Box-Packaged is required"),
});

export type AssetPortfolioInfoFormValues = z.infer<typeof assetPortfolioInfoSchema>;
export type AssetPortfolioInfoFormInputValues = z.input<typeof assetPortfolioInfoSchema>;

export const assetPortfolioRejectSchema = z.object({
  reason: requiredText("Reason for rejection is required"),
});

export type AssetPortfolioRejectFormValues = z.infer<typeof assetPortfolioRejectSchema>;
export type AssetPortfolioRejectFormInputValues = z.input<typeof assetPortfolioRejectSchema>;

export const loanCaseApprovalSchema = z.object({
  thresholdAmount: requiredText("Liquidation threshold amount is required").refine(
    (value) => !Number.isNaN(Number(value)),
    "Enter a valid liquidation threshold amount",
  ),
  disbursementDate: z
    .date()
    .optional()
    .refine((value) => value !== undefined, "Date of disbursement is required"),
  repaymentDue: z
    .date()
    .optional()
    .refine((value) => value !== undefined, "Repayment due date is required"),
});

export type LoanCaseApprovalFormValues = z.infer<typeof loanCaseApprovalSchema>;
export type LoanCaseApprovalFormInputValues = z.input<typeof loanCaseApprovalSchema>;

export const loanCaseRejectSchema = z.object({
  reason: requiredText("Reason for rejection is required"),
});

export type LoanCaseRejectFormValues = z.infer<typeof loanCaseRejectSchema>;
export type LoanCaseRejectFormInputValues = z.input<typeof loanCaseRejectSchema>;

export const supportTicketRequestSchema = z.object({
  resolved: z.boolean(),
});

export type SupportTicketRequestFormValues = z.infer<typeof supportTicketRequestSchema>;
export type SupportTicketRequestFormInputValues = z.input<typeof supportTicketRequestSchema>;
