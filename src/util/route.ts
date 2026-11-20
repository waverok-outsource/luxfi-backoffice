const route = {
  auth: {
    login: "/auth/login",
    logout: "/logout",
    forgotPassword: "/auth/forgot-password",
    verifyResetPin: "/auth/forgot-password/verify",
    reset: "/auth/reset-password",
  },
  dashboard: {
    home: "/",
    customers: "/customers",
    kyc: "/kyc",
    kycConfigurationNew: "/kyc/configurations/new",
    kycConfiguration: (kycRef: string) => `/kyc/configurations/${encodeURIComponent(kycRef)}`,
    kycConfigurationEdit: (kycRef: string) =>
      `/kyc/configurations/${encodeURIComponent(kycRef)}/edit`,
    kycSubmission: (submissionId: string) =>
      `/kyc/submissions/${encodeURIComponent(submissionId)}`,
    kycResourceAccess: "/kyc?tab=resource-access",
    kycResourceAccessNew: "/kyc/resource-access/new",
    kycResourceAccessRule: (ruleId: string) =>
      `/kyc/resource-access/${encodeURIComponent(ruleId)}`,
    kycResourceAccessEdit: (ruleId: string) =>
      `/kyc/resource-access/${encodeURIComponent(ruleId)}/edit`,
    marketplace: "/marketplace",
    portfolioManagement: "/portfolio-management",
    assetManagement: "/asset-management",
    assetClass: (assetClassId: string) =>
      `/asset-management/${encodeURIComponent(assetClassId)}`,
    assetCategory: (assetClassId: string, categoryId: string) =>
      `/asset-management/${encodeURIComponent(assetClassId)}/categories/${encodeURIComponent(categoryId)}`,
    assetLoans: "/asset-loans",
    smartContracts: "/smart-contracts",
    riskManagement: "/risk-management",
    paymentsSettlements: "/payments-settlements",
    growthMarketing: "/growth-marketing",
    helpSupport: "/help-support",
    approvals: "/approvals",
    systemSettings: "/system-settings",
    systemSettingsFees: "/system-settings?tab=fees",
    feeNew: "/system-settings/fees/new",
    fee: (feeId: string) => `/system-settings/fees/${encodeURIComponent(feeId)}`,
    feeEdit: (feeId: string) => `/system-settings/fees/${encodeURIComponent(feeId)}/edit`,
  },
};

export default route;
