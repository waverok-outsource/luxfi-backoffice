import type { PortfolioStatus } from "@/module/dashboard/portfolio-management/data";

const VALID_PORTFOLIO_STATUSES: PortfolioStatus[] = [
  "published",
  "completed",
  "unpublished",
  "pending",
  "rejected",
  "approved",
];

type NormalizePortfolioStatusOptions = {
  onSale?: boolean;
  fallback?: PortfolioStatus;
};

function isPortfolioStatus(value: string): value is PortfolioStatus {
  return VALID_PORTFOLIO_STATUSES.includes(value as PortfolioStatus);
}

export function normalizePortfolioStatus(
  status: string | undefined,
  options: NormalizePortfolioStatusOptions = {},
): PortfolioStatus {
  const normalized = status?.toLowerCase();

  if (normalized && isPortfolioStatus(normalized)) {
    return normalized;
  }

  if (typeof options.onSale === "boolean") {
    return options.onSale ? "published" : "unpublished";
  }

  return options.fallback ?? "unpublished";
}
