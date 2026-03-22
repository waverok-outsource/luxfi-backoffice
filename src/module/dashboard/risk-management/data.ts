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

export const featuredMetrics: RiskManagementMetric[] = [
  {
    title: "Average Portfolio LTV",
    value: "58.6%",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Loans  (> 70%) LTV",
    value: "27",
    trend: "99.9%",
    tone: "negative",
  },
];

export const summaryMetrics: RiskManagementMetric[] = [
  {
    title: "Liquidation Triggered",
    value: "41",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Capital At Risk",
    value: "$312,000",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Coverage Ratio After Liquidation",
    value: "1.18x",
    trend: "99.9%",
    tone: "positive",
  },
];

export const riskExposureShares: RiskExposureShare[] = [
  { label: "Rolex", percent: 60, color: "#2B6B4D" },
  { label: "Patek Philippe", percent: 40, color: "#3FA16F" },
  { label: "Audemar Piguet", percent: 40, color: "#4FB685" },
  { label: "Cartier", percent: 40, color: "#5BC191" },
  { label: "Hublot", percent: 25, color: "#7FE0A7" },
];

export const loanCollateralTrend: RiskTrendPoint[] = [
  { month: "Jan '25", loanValue: 560, collateralValue: 410 },
  { month: "Feb '25", loanValue: 430, collateralValue: 300 },
  { month: "Mar '25", loanValue: 540, collateralValue: 225 },
  { month: "Apr '25", loanValue: 520, collateralValue: 280 },
  { month: "May '25", loanValue: 660, collateralValue: 380 },
  { month: "Jun '25", loanValue: 460, collateralValue: 340 },
  { month: "Jul '25", loanValue: 780, collateralValue: 110 },
  { month: "Aug '25", loanValue: 810, collateralValue: 230 },
  { month: "Sep '25", loanValue: 460, collateralValue: 420 },
  { month: "Oct '25", loanValue: 450, collateralValue: 175 },
  { month: "Nov '25", loanValue: 590, collateralValue: 320 },
  { month: "Dec '25", loanValue: 670, collateralValue: 285 },
];
