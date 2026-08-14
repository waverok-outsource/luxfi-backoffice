import type { StatusConfig } from "@/components/table";
import type { PaymentStatus } from "@/module/dashboard/payments-settlements/data";

export type PaymentStatusOverrides = Partial<StatusConfig<PaymentStatus>>;

export const PAYMENTS_STATUS_CONFIG = {
  completed: { label: "Completed", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  failed: { label: "Failed", variant: "error" as const },
  liquidated: { label: "Liquidated", variant: "error" as const },
} satisfies StatusConfig<PaymentStatus>;

export function getPaymentStatusConfig(status: PaymentStatus) {
  return PAYMENTS_STATUS_CONFIG[status];
}

/**
 * The API returns capitalized status strings (e.g. "Completed", "Failed").
 * Falls back to "pending" for any value the backend sends that we don't
 * recognize, so an unmapped status doesn't crash the badge lookup.
 */
export function normalizePaymentStatus(value: string): PaymentStatus {
  const normalized = value.trim().toLowerCase();
  return normalized in PAYMENTS_STATUS_CONFIG ? (normalized as PaymentStatus) : "pending";
}
