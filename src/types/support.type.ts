import type { ApiResponse, PaginatedApiResponse } from "./global";
import type { MetricValue } from "./analytics.type";

export type SupportTicketStatus = "pending" | "resolved";

export type SupportTicketType = {
  ticketRef: string;
  ticketId: string;
  issueCategory: string;
  issueDescription: string;
  channel: string; // lowercase from API ("web" | "mobile") — capitalize at render time
  email: string;
  phoneNumber: string;
  status: SupportTicketStatus;
  customerResolutionStatus?: string;
  customerName?: string; // present on admin-wide list, absent on customer-scoped list
  requestDate: string;
  resolvedAt?: string;
};

export type SupportTicketsResponseType = PaginatedApiResponse<SupportTicketType[]>;

// GET /v1/analytics/support-cases
export type SupportCaseAnalyticsType = {
  metrics: {
    totalTickets: MetricValue;
    pendingTickets: MetricValue;
    resolvedTickets: MetricValue;
  };
  passwordResets: {
    total: MetricValue;
    pending: MetricValue;
    reset: MetricValue;
  };
  period: { from: string; to: string };
};

export type SupportCaseAnalyticsResponseType = ApiResponse<SupportCaseAnalyticsType>;

export type ReviewSupportTicketPayloadType = {
  status: SupportTicketStatus;
};

// ASSUMPTION: request/response shape not sampled by backend; mirrors the
// binary "Mark Issue as Resolved" toggle the existing UI already has. See ADR 0019.
export type ReviewSupportTicketResponseType = ApiResponse<SupportTicketType>;

export type PasswordResetRequestStatus = "pending" | "reset";

export type PasswordResetRequestType = {
  requestRef: string;
  logId: string;
  initiatorName: string;
  initiatorEmail: string;
  assignedRole: string;
  channel: string; // lowercase from API — capitalize at render time
  status: PasswordResetRequestStatus;
  validUntil: string;
  requestDate: string;
  resetAt?: string;
};

export type PasswordResetRequestsResponseType = PaginatedApiResponse<PasswordResetRequestType[]>;

// ASSUMPTION: response shape not explicitly a documented wrapper convention
// elsewhere, but consistent with every other single-object endpoint in this
// codebase. See ADR 0019.
export type ResetPasswordRequestResponseType = ApiResponse<PasswordResetRequestType>;
