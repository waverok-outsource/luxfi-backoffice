import type { ApiResponse, PaginatedApiResponse } from "./global";

export const APPROVAL_STATUSES = [
  "pending",
  "processing",
  "approved",
  "failed",
  "rejected",
  "cancelled",
  "expired",
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const APPROVAL_HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export type ApprovalHttpMethod = (typeof APPROVAL_HTTP_METHODS)[number];

export type ApprovalListScope = "queue" | "mine";

export type ApprovalHistoryEvent = {
  action: string;
  actorId: string;
  actorName: string;
  note: string;
  at: string;
};

/** Checker replay of the stored request. `approval_id` is included in `query`. */
export type ApprovalReplay = {
  method: string;
  path: string;
  query: Record<string, unknown>;
  body: unknown;
};

export type ApprovalType = {
  approvalId: string;
  description: string;
  status: ApprovalStatus | "unknown";
  makerId: string;
  maker: string;
  checkerId: string;
  checker: string;
  unit: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  checkedAt: string;
  executedAt: string;
  executionError: string;
  executionStatusCode?: number;
  rejectionReason: string;
  history: ApprovalHistoryEvent[];
  replay?: ApprovalReplay;
  canCheck: boolean;
};

export type ApprovalsResponseType = PaginatedApiResponse<ApprovalType[]>;

export type ApprovalResponseType = ApiResponse<ApprovalType>;

export type ApprovalActionResponseType = ApiResponse<unknown>;

export function isApprovalStatus(value: string): value is ApprovalStatus {
  return (APPROVAL_STATUSES as readonly string[]).includes(value);
}

export function isApprovalHttpMethod(value: string): value is ApprovalHttpMethod {
  return (APPROVAL_HTTP_METHODS as readonly string[]).includes(value);
}
