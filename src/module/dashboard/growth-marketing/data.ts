export type GrowthMetricTone = "positive" | "negative";

export type GrowthMarketingMetric = {
  title: string;
  value: string;
  trend: string;
  period?: string;
  tone: GrowthMetricTone;
};

export type GrowthMarketingLocationShare = {
  country: string;
  percent: number;
  color: string;
};

export type GrowthMarketingTrendPoint = {
  month: string;
  verified: number;
  unverified: number;
};

export const featuredMetrics: GrowthMarketingMetric[] = [
  {
    title: "Inflow Transaction Count",
    value: "1,450",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Outflow Transaction Count",
    value: "610",
    trend: "99.9%",
    tone: "negative",
  },
];

export const summaryMetrics: GrowthMarketingMetric[] = [
  {
    title: "Customer Leads",
    value: "1,420",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Sales",
    value: "1,420",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Online Purchases",
    value: "1,420",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Loan Requests",
    value: "1,420",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "App Downloads",
    value: "312",
    trend: "99.9%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Website Visitors",
    value: "610",
    trend: "99.9%",
    period: "Last 7 days",
    tone: "positive",
  },
];

export const locationShares: GrowthMarketingLocationShare[] = [
  { country: "Nigeria", percent: 60, color: "#2B6B4D" },
  { country: "United Kingdom", percent: 40, color: "#3FA16F" },
  { country: "Ghana", percent: 40, color: "#4FB685" },
  { country: "France", percent: 40, color: "#68C996" },
  { country: "South Africa", percent: 33, color: "#7FE0A7" },
  { country: "UAE", percent: 25, color: "#86E8B3" },
  { country: "Kenya", percent: 15, color: "#B8F6D0" },
];

export const userGrowthTrend: GrowthMarketingTrendPoint[] = [
  { month: "Jan '25", verified: 560, unverified: 410 },
  { month: "Feb '25", verified: 430, unverified: 300 },
  { month: "Mar '25", verified: 540, unverified: 225 },
  { month: "Apr '25", verified: 520, unverified: 280 },
  { month: "May '25", verified: 660, unverified: 380 },
  { month: "Jun '25", verified: 460, unverified: 340 },
  { month: "Jul '25", verified: 780, unverified: 110 },
  { month: "Aug '25", verified: 810, unverified: 230 },
  { month: "Sep '25", verified: 460, unverified: 420 },
  { month: "Oct '25", verified: 450, unverified: 175 },
  { month: "Nov '25", verified: 590, unverified: 320 },
  { month: "Dec '25", verified: 670, unverified: 285 },
];

export const totalUsersLabel = "12,456 Total Users";
