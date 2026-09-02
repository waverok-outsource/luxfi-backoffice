import { z } from "zod";

export const blacklistCustomerSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  notice: z.string().min(3, "Enter a compliance notice"),
});

export type BlacklistCustomerFormValues = z.infer<typeof blacklistCustomerSchema>;

const requiredText = (message: string) => z.string().trim().min(1, message);

export const loanCaseApprovalSchema = z.object({
  thresholdAmount: requiredText("Liquidation threshold amount is required").refine(
    (value) => !Number.isNaN(Number(value)),
    "Enter a valid liquidation threshold amount",
  ),
  disbursementDate: z
    .date()
    .optional()
    .refine((value) => value !== undefined, "Date of disbursement is required"),
  repaymentDue: z.date().optional(),
});

export type LoanCaseApprovalFormValues = z.infer<typeof loanCaseApprovalSchema>;
export type LoanCaseApprovalFormInputValues = z.input<typeof loanCaseApprovalSchema>;

export const assetLoanReviewSchema = loanCaseApprovalSchema.extend({
  certificationPapersAvailable: z
    .boolean()
    .nullable()
    .refine((value) => value !== null, "Certification Papers is required"),
  boxPackaged: z
    .boolean()
    .nullable()
    .refine((value) => value !== null, "Box-Packaged is required"),
  preOwned: z.boolean().nullable(),
  anyPhysicalDefects: z.boolean().nullable(),
  remarks: z.string(),
  proofFileName: z.string().optional(),
  submittedDate: z.date().optional(),
  examinationDate: z.date().optional(),
  officerEmail: z.string().optional(),
});

export type AssetLoanReviewFormValues = z.infer<typeof assetLoanReviewSchema>;
export type AssetLoanReviewFormInputValues = z.input<typeof assetLoanReviewSchema>;

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
