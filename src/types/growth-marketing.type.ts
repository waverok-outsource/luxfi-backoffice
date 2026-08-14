export type GrowthMarketingRange = {
  from: string | null;
  to: string | null;
  previousFrom?: string | null;
  previousTo?: string | null;
  label: string;
};

export type GrowthMarketingMetricItem = {
  key: string;
  label: string;
  value: number;
  percentageChange: number;
  period: string;
  source: string;
};

export type GrowthMarketingMetricsType = {
  range: GrowthMarketingRange;
  metrics: GrowthMarketingMetricItem[];
};

export type GrowthMarketingCountryDistribution = {
  country: string;
  count: number;
  percentage: number;
};

export type GrowthMarketingCustomerDistributionType = {
  range: Omit<GrowthMarketingRange, "previousFrom" | "previousTo">;
  totalCustomers: number;
  distribution: GrowthMarketingCountryDistribution[];
};

export type GrowthMarketingUserGrowthPoint = {
  year: number;
  month: number;
  label: string;
  verified: number;
  unverified: number;
  total: number;
};

export type GrowthMarketingUserGrowthType = {
  range: Omit<GrowthMarketingRange, "previousFrom" | "previousTo">;
  totalUsers: number;
  points: GrowthMarketingUserGrowthPoint[];
};

export type GrowthMarketingOverviewType = {
  kpis: GrowthMarketingMetricsType;
  customerDistribution: GrowthMarketingCustomerDistributionType;
  userGrowth: GrowthMarketingUserGrowthType;
};
