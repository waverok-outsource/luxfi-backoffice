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
  },
};

export default route;
