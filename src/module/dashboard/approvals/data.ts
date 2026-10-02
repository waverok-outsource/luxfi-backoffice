import type { StatusConfig } from "@/components/table";
import type { ApprovalStatus } from "@/types/approval.type";

export const APPROVAL_STATUS_CONFIG = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
  expired: { label: "Expired", variant: "disabled" },
  unknown: { label: "Unknown", variant: "neutral" },
} satisfies StatusConfig<ApprovalStatus | "unknown">;

export function formatApprovalPayload(payload: unknown) {
  if (payload == null || payload === "") {
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
