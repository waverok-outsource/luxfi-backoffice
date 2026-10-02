import type { ApiResponse, PaginatedApiResponse } from "./global";

export const APPROVAL_STATUSES = ["pending", "expired", "rejected", "approved"] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const APPROVAL_HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export type ApprovalHttpMethod = (typeof APPROVAL_HTTP_METHODS)[number];

export type ApprovalType = {
  approvalId: string;
  method: string;
  path?: string;
  url?: string;
  payload?: unknown;
  description?: string;
  status: ApprovalStatus | "unknown";
  maker: string;
  checker?: string;
  unit: string;
};

export type ApprovalsResponseType = PaginatedApiResponse<ApprovalType[]>;

export type ApprovalActionResponseType = ApiResponse<unknown>;

export function isApprovalStatus(value: string): value is ApprovalStatus {
  return (APPROVAL_STATUSES as readonly string[]).includes(value);
}

export function isApprovalHttpMethod(value: string): value is ApprovalHttpMethod {
  return (APPROVAL_HTTP_METHODS as readonly string[]).includes(value);
}

export function getApprovalRequestTarget(approval: Pick<ApprovalType, "path" | "url">) {
  return (approval.path || approval.url || "").trim();
}
