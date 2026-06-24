export type PortfolioTabValue =
  | "portfolio-inventory"
  | "asset-brands"
  | "asset-categories"
  | "purchase-requests"
  | "sale-requests"
  | "audit-log";

export type PortfolioStatus =
  | "published"
  | "completed"
  | "unpublished"
  | "pending"
  | "rejected"
  | "approved";

export type PortfolioTableRow = Record<string, string | number> & {
  id: string;
  status?: PortfolioStatus;
};

type TabConfig = {
  value: PortfolioTabValue;
  label: string;
};

export const portfolioTabs: TabConfig[] = [
  {
    value: "portfolio-inventory",
    label: "Portfolio Inventory",
  },
  {
    value: "asset-brands",
    label: "Asset Brands",
  },
  {
    value: "asset-categories",
    label: "Asset Categories",
  },
  {
    value: "purchase-requests",
    label: "Purchase Requests",
  },
  {
    value: "sale-requests",
    label: "Sale Requests",
  },
  {
    value: "audit-log",
    label: "Audit Log",
  },
];

export const DEFAULT_PORTFOLIO_TAB: PortfolioTabValue = "portfolio-inventory";
