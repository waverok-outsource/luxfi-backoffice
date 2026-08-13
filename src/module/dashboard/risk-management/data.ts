export type RiskManagementMetric = {
  title: string;
  value: string;
  trend: string;
  period?: string;
  tone: "positive" | "negative";
};

export type RiskExposureShare = {
  label: string;
  percent: number;
  color: string;
};

export type RiskTrendPoint = {
  month: string;
  loanValue: number;
  collateralValue: number;
};
