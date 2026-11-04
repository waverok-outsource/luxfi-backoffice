const baseUrl = "/v1";

const CustomerRoute = {
  customers: `${baseUrl}/customers`,
  analytics: `${baseUrl}/analytics/customers`,
  kycTiers: `${baseUrl}/kyc-tiers`,
  customerKyc: (customerId: string) => `${baseUrl}/customers/${customerId}/kyc`,
  customerKycSubmissions: (customerId: string) =>
    `${baseUrl}/customers/${customerId}/kyc/submissions`,
  customerKycTier: (customerId: string, tierId: string) =>
    `${baseUrl}/customers/${customerId}/kyc/${tierId}`,
};

export default CustomerRoute;
