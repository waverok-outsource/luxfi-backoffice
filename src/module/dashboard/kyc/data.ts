import type { StatusConfig } from "@/components/table";
import type { KycSubmissionStatus } from "@/types/kyc.type";

export const PAGE_SIZE = 10;

export const SUBMISSION_STATUS_CONFIG: StatusConfig<KycSubmissionStatus> = {
  draft: { label: "Draft", variant: "disabled" },
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

export const SEVERITY_BADGE = {
  low: { label: "Low", variant: "success" as const },
  medium: { label: "Medium", variant: "warning" as const },
  high: { label: "High", variant: "error" as const },
};

export function submissionStatusMeta(status: string) {
  if (status in SUBMISSION_STATUS_CONFIG) {
    return SUBMISSION_STATUS_CONFIG[status as KycSubmissionStatus];
  }
  return { label: status || "Unknown", variant: "neutral" as const };
}
