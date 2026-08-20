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
    marketplace: "/marketplace",
    portfolioManagement: "/portfolio-management",
    assetManagement: "/asset-management",
    assetLoans: "/asset-loans",
    smartContracts: "/smart-contracts",
    riskManagement: "/risk-management",
    paymentsSettlements: "/payments-settlements",
    growthMarketing: "/growth-marketing",
    helpSupport: "/help-support",
    systemSettings: "/system-settings",
  },
};

export default route;
