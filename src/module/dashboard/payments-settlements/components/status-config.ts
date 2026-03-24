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
