import { ApiResponse, PaginatedApiResponse } from "./global";
import type { ConnectivitySummary, MetricValue } from "./analytics.type";

// Not a fixed union: the backend's customer account status vocabulary has
// already diverged from the team-member one ("blacklisted" vs "blacklist"),
// so treat it as a free-form string rather than assuming a shared enum.
export type CustomerAccountStatus = string;

export type CustomerType = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  roleTitle: string;
  accountStatus: CustomerAccountStatus;
  roleId: string;
  userRef: string;
  userId: string;
  phoneNumber: string;
  countryCode: string;
  countryName: string;
  kycTier?: string;
  kycTierNumber?: number;
  riskLevel: string;
};

export type CustomerAnalyticsGrowthPattern = "upward" | "downward";

export type CustomerAnalyticsMetricType = {
  value: number;
  growth: number | string;
  growthUnit: string;
  growthDuration: string;
  growthPattern: CustomerAnalyticsGrowthPattern;
};

export type CustomerConnectivityStatType = {
  online: { count: number; percent: number };
  offline: { count: number; percent: number };
};

export type CustomerStatsType = {
  customerCount: CustomerAnalyticsMetricType;
  connectivity: CustomerConnectivityStatType;
  customerGrowth: CustomerAnalyticsMetricType;
};

export type CustomersDataType = {
  customers: CustomerType[];
  stats: CustomerStatsType;
};

export type CustomersResponseType = PaginatedApiResponse<CustomersDataType>;

export type CustomerMoneyMetricType = {
  value: number;
  currencyCode: string;
  growth: number;
  growthUnit: string;
  growthDuration: string;
  growthPattern: CustomerAnalyticsGrowthPattern;
};

export type CustomerRatingMetricType = {
  value: number;
  ratingUnit: string;
  growth: number;
  growthUnit: string;
  growthDuration: string;
  growthPattern: CustomerAnalyticsGrowthPattern;
};

export type CustomerDetailType = CustomerType & {
  walletBalance: CustomerMoneyMetricType;
  portfolio: CustomerMoneyMetricType;
  creditRating: CustomerRatingMetricType;
};

export type CustomerDetailResponseType = ApiResponse<CustomerDetailType>;

export type BlacklistCustomerPayloadType = {
  note: string;
  reason: string;
  status: boolean;
};

export type BlacklistCustomerResponseType = ApiResponse<CustomerDetailType>;

export type CustomerSessionLogLocationType = {
  city: string;
  country: string;
};

export type CustomerSessionLogType = {
  sessionLogId: string;
  sessionId: string;
  deviceName: string;
  device: string;
  deviceModel: string;
  channel: string;
  ipAddress: string;
  userLocation: string;
  location: CustomerSessionLogLocationType;
  activity: string;
  sessionDate: string;
  timestamp: string;
  date: string;
  createdAt: string;
};

export type CustomerSessionLogsResponseType = PaginatedApiResponse<CustomerSessionLogType[]>;

// GET /v1/analytics/customers
export type CustomerAnalyticsType = {
  metrics: {
    totalRegistered: MetricValue;
    averageGrowth: MetricValue;
  };
  connectivity: ConnectivitySummary;
  period: { from: string; to: string };
};

export type CustomerAnalyticsResponseType = ApiResponse<CustomerAnalyticsType>;

// ---- GET /v1/kyc-tiers ----
// Paginated; dropdown callers pass a high perPage (same stopgap as valuation providers).
export type KycTierType = {
  kycRef: string;
  title: string;
  description: string | null;
  tierNumber: number;
  severity: string;
  riskBand: { min: number; max: number };
  provider?: string;
  createdAt: string;
  updatedAt: string;
};

export type KycTiersResponseType = PaginatedApiResponse<KycTierType[]>;
