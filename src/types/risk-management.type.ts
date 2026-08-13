import type { ApiResponse } from "./global";

export type RiskMetricTrend = {
  percentage: number;
  displayValue: string;
  direction: "up" | "down" | "flat";
};

export type RiskMetricValue = {
  value: number;
  displayValue: string;
  trend: RiskMetricTrend;
};

export type RiskManagementSummaryType = {
  averagePortfolioLtv: RiskMetricValue;
  highLtvLoans: RiskMetricValue;
  liquidationTriggered: RiskMetricValue;
  capitalAtRisk: RiskMetricValue;
  coverageRatioAfterLiquidation: RiskMetricValue;
  period: { from: string | null; to: string | null };
  highLtvThreshold: number;
};

export type RiskManagementSummaryResponseType = ApiResponse<RiskManagementSummaryType>;

export type AssetExposureItem = {
  assetName: string;
  exposure: number;
  displayValue: string;
  loanCount: number;
  outstandingAmount: number;
};

export type CollateralToValuePoint = {
  month: string;
  monthKey: string;
  loanValue: number;
  collateralValue: number;
};

export type RiskManagementAnalyticsType = {
  assetExposure: AssetExposureItem[];
  collateralToValue: CollateralToValuePoint[];
  period: { from: string | null; to: string | null };
};

export type RiskManagementAnalyticsResponseType = ApiResponse<RiskManagementAnalyticsType>;
