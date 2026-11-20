import type { StatusConfig } from "@/components/table";
import type { ApprovalStatus } from "@/types/approval.type";

export const APPROVAL_STATUS_CONFIG = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  failed: { label: "Failed", variant: "error" },
  rejected: { label: "Rejected", variant: "error" },
  cancelled: { label: "Cancelled", variant: "neutral" },
  expired: { label: "Expired", variant: "disabled" },
  unknown: { label: "Unknown", variant: "neutral" },
} satisfies StatusConfig<ApprovalStatus | "unknown">;

const APPROVAL_ACTION_LABELS: Record<string, string> = {
  created: "Created",
  claimed: "Claimed",
  executed: "Executed",
  execution_failed: "Execution failed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  expired: "Expired",
  self_check_blocked: "Own request blocked",
  mismatch_blocked: "Request did not match",
};

export function approvalActionLabel(action: string) {
  const known = APPROVAL_ACTION_LABELS[action];
  if (known) {
    return known;
  }

  return action
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatApprovalPayload(payload: unknown) {
  if (payload == null || payload === "") {
    return "";
  }

  if (Array.isArray(payload) && payload.length === 0) {
    return "";
  }

  if (typeof payload === "object" && !Array.isArray(payload) && Object.keys(payload).length === 0) {
    return "";
  }

  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (!trimmed) {
      return "";
    }

    try {
      return JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
      return payload;
    }
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}
