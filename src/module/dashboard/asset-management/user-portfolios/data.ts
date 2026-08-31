export type UserPortfolioDetailsTabValue = "listed-assets" | "activity-log";

type TabConfig = {
  value: UserPortfolioDetailsTabValue;
  label: string;
};

export const userPortfolioDetailsTabs: TabConfig[] = [
  { value: "listed-assets", label: "Listed Assets" },
  { value: "activity-log", label: "Manage Activity Log" },
];

export const DEFAULT_USER_PORTFOLIO_DETAILS_TAB: UserPortfolioDetailsTabValue = "listed-assets";

export type PortfolioActivityLogEntry = {
  logId: string;
  action: string;
  initiatorName: string;
  initiatorRole: string;
  actionDateLabel: string;
  actionTimestampLabel: string;
};

// "Manage Activity Log" has no confirmed backend endpoint yet — keep a small static map so the tab renders.
export const mockActivityLogByPortfolioId: Record<string, PortfolioActivityLogEntry[]> = {
  ID12344: [
    {
      logId: "LOG-0001",
      action: "Asset Verified",
      initiatorName: "Marketing Officer",
      initiatorRole: "Compliance Officer",
      actionDateLabel: "03-05-2026",
      actionTimestampLabel: "10:23 AM",
    },
    {
      logId: "LOG-0002",
      action: "Asset Verified",
      initiatorName: "Marketing Officer",
      initiatorRole: "Compliance Officer",
      actionDateLabel: "10-04-2026",
      actionTimestampLabel: "09:15 AM",
    },
    {
      logId: "LOG-0003",
      action: "Asset Added",
      initiatorName: "System",
      initiatorRole: "Automated",
      actionDateLabel: "10-01-2026",
      actionTimestampLabel: "12:00 AM",
    },
  ],
};
