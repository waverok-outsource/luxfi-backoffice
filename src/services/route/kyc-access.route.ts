const baseUrl = "/v1/kyc-resource-access";

const KycAccessRoute = {
  rules: baseUrl,
  resources: `${baseUrl}/resources`,
  endpoints: `${baseUrl}/endpoints`,
  // The access-rule contract reads tiers from v1 (permission: viewkyc).
  tiers: "/v1/kyc-tiers",
  rule: (ruleId: string) => `${baseUrl}/${encodeURIComponent(ruleId)}`,
};

export default KycAccessRoute;
