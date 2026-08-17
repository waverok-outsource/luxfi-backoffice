import type { ApiResponse } from "./global";

export type MetricTrend = {
  percentage: number;
  displayValue: string;
  direction: "up" | "down" | "flat";
  period?: string;
};

export type MetricValue = {
  value: number;
  displayValue: string;
  trend: MetricTrend;
};

export type ConnectivityItem = {
  key: string;
  label: string;
  value: number;
  displayValue: string;
  percentage: number;
  percentageDisplay: string;
};

export type ConnectivitySummary = {
  total: number;
  items: ConnectivityItem[];
};

export type LiquidityPoolItem = {
  currencyCode: string;
  balance: number;
  displayValue: string;
  percentage: number;
  percentageDisplay: string;
};

export type DashboardActivity = {
  id: string;
  message: string;
  event: string;
  eventTag: string;
  resource: string;
  status: "success" | "failed" | string;
  maker: string;
  createdAt: string;
};

export type LoanGraphPoint = {
  month: string;
  monthKey: string;
  disbursement: number;
  repayment: number;
};

export type AssetBrand = {
  brandId: string;
  name: string;
  category: string;
  status: string;
  assetsCount: number;
  imageUrl: string | null;
};

export type DashboardAnalyticsType = {
  liquidityPool: {
    total: number;
    totalDisplay: string;
    items: LiquidityPoolItem[];
  };
  metrics: {
    inflow: MetricValue;
    outflow: MetricValue;
    assets: MetricValue;
    customers: MetricValue;
    verifiedCustomers: MetricValue;
    loanDisbursed: MetricValue;
    loanRepayment: MetricValue;
    activeLoans: MetricValue;
    nearLiquidations: MetricValue;
  };
  activities: DashboardActivity[];
  riskAlarms: unknown[];
  loanGraph: LoanGraphPoint[];
  assetBrands: AssetBrand[];
  period: { from: string | null; to: string | null };
};

export type DashboardAnalyticsResponseType = ApiResponse<DashboardAnalyticsType>;
