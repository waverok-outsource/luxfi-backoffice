export type HelpSupportMetric = {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "negative";
};

export const helpSupportMetrics: HelpSupportMetric[] = [
  {
    title: "Total Support Tickets",
    value: "312",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Pending Tickets",
    value: "45",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Resolved Tickets",
    value: "100",
    trend: "99.9%",
    tone: "positive",
  },
];

export type HelpSupportTabValue = "support-tickets" | "password-reset-requests";

export const DEFAULT_HELP_SUPPORT_TAB: HelpSupportTabValue = "support-tickets";

export const helpSupportTabs: Array<{
  label: string;
  value: HelpSupportTabValue;
}> = [
  { label: "Support Tickets", value: "support-tickets" },
  { label: "Password Reset Requests", value: "password-reset-requests" },
];
