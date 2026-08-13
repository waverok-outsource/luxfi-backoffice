export type HelpSupportTabValue = "support-tickets" | "password-reset-requests";

export const DEFAULT_HELP_SUPPORT_TAB: HelpSupportTabValue = "support-tickets";

export const helpSupportTabs: Array<{
  label: string;
  value: HelpSupportTabValue;
}> = [
  { label: "Support Tickets", value: "support-tickets" },
  { label: "Password Reset Requests", value: "password-reset-requests" },
];
