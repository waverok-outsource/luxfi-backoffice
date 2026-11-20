const baseUrl = "/v1/kyc-resource-access";

const KycAccessRoute = {
  rules: baseUrl,
  resources: `${baseUrl}/resources`,
  rule: (ruleId: string) => `${baseUrl}/${encodeURIComponent(ruleId)}`,
};

export default KycAccessRoute;
