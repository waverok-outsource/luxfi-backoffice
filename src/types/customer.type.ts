import { ApiResponse, PaginatedApiResponse } from "./global";
import type { ConnectivitySummary, MetricValue } from "./analytics.type";
import type { KycSubmission } from "./kyc.type";

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
  // Set by the backend once an account is opened. Older customers may have an
  // account without the flag, so the details page also checks the account list.
  hasVirtualAccount?: boolean;
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

export type CustomerKycUiStatus =
  | "completed"
  | "in_progress"
  | "submitted"
  | "rejected"
  | "not_started"
  | "locked";

export type CustomerKycTierProgress = {
  required: number;
  completed: number;
  percent: number;
};

export type CustomerKycTierCard = {
  kycRef: string;
  tierNumber: number;
  title: string;
  severity: string;
  uiStatus: CustomerKycUiStatus | string;
  isLocked: boolean;
  isCompleted: boolean;
  canStart: boolean;
  canSubmit?: boolean;
  progress?: CustomerKycTierProgress;
};

export type CustomerKycOverview = {
  customerId: string;
  currentTierNumber: number | null;
  highestApprovedTierNumber: number;
  tiers: CustomerKycTierCard[];
};

export type CustomerKycOverviewResponse = ApiResponse<CustomerKycOverview>;

export type CustomerKycSubmissions = {
  customerId: string;
  submissions: KycSubmission[];
};

export type CustomerKycSubmissionsResponse = ApiResponse<CustomerKycSubmissions>;

export type ChangeCustomerKycTierResult = CustomerKycOverview & {
  action: "upgrade" | "downgrade" | "reassign" | string;
  reason: string | null;
};

export type ChangeCustomerKycTierResponse = ApiResponse<ChangeCustomerKycTierResult>;

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

// ---- /v1/customers/:customerId/virtual-accounts ----
// A virtual account is a fiat wallet at a payment provider. The backend
// stores the bank in addressName, the account number in addressNumber and
// the provider's account id in addressId.
export type CustomerVirtualAccountType = {
  _id?: string;
  addressName: string;
  addressNumber: string;
  addressId: string;
  currencyCode: string;
  currencyName?: string;
  processor: string;
  balance?: number;
  isActive: boolean;
  createdAt: string;
};

export type CustomerVirtualAccountsResponseType = ApiResponse<CustomerVirtualAccountType[]>;

export type CreateCustomerVirtualAccountPayload = {
  // Both optional: with no processor the platform picks a healthy provider.
  processor?: string;
  bankCode?: string;
};

export type CreateCustomerVirtualAccountResponseType = ApiResponse<CustomerVirtualAccountType>;
