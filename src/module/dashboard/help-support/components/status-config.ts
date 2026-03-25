import type { StatusConfig } from "@/components/table";
import type {
  PasswordResetStatus,
  SupportTicketStatus,
} from "@/module/dashboard/help-support/data";

export const HELP_SUPPORT_STATUS_CONFIG = {
  resolved: { label: "Resolved", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
} satisfies StatusConfig<SupportTicketStatus>;

export const PASSWORD_RESET_STATUS_CONFIG = {
  reset: { label: "Reset", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
} satisfies StatusConfig<PasswordResetStatus>;

export function getHelpSupportStatusConfig(status: SupportTicketStatus) {
  return HELP_SUPPORT_STATUS_CONFIG[status];
}

export function getPasswordResetStatusConfig(status: PasswordResetStatus) {
  return PASSWORD_RESET_STATUS_CONFIG[status];
}
