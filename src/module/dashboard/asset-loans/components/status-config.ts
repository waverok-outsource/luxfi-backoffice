import type { StatusConfig } from "@/components/table";

import type { AssetLoanStatus } from "@/module/dashboard/asset-loans/data";

export const ASSET_LOANS_STATUS_CONFIG = {
  pending: { label: "Pending", variant: "warning" as const },
  active: { label: "Active", variant: "success" as const },
  liquidated: { label: "Liquidated", variant: "error" as const },
  rejected: { label: "Rejected", variant: "disabled" as const },
  completed: { label: "Completed", variant: "success" as const },
} satisfies StatusConfig<AssetLoanStatus>;
