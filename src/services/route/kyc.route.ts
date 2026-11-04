const baseUrl = "/v2/kyc-tiers";

const KycRoute = {
  tiers: baseUrl,
  tier: (kycRef: string) => `${baseUrl}/${kycRef}`,
  submissions: `${baseUrl}/submissions`,
  submission: (submissionId: string) => `${baseUrl}/submissions/${submissionId}`,
  revealSubmission: (submissionId: string) => `${baseUrl}/submissions/${submissionId}/reveal`,
  reviewSubmission: (submissionId: string) => `${baseUrl}/submissions/${submissionId}/review`,
  verify: `${baseUrl}/verify`,
};

export default KycRoute;
