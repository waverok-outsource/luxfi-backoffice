const keyFactory = {
  audits: {
    all: ["audits"],
    list: (resource: string, query: string) => ["audits", resource, query],
  },

  customers: {
    all: ["customers"],
    analytics: (query: string) => ["customers", "analytics", query],
    list: (query: string) => ["customers", query],
    details: (id: string) => ["customers", id],
    sessionLogs: (id: string) => ["customers", id, "session-logs"],
    kycTiers: {
      all: ["customers", "kyc-tiers"],
      list: (query: string) => ["customers", "kyc-tiers", query],
    },
  },

  assetManagement: {
    all: ["asset-management"],
    classes: {
      all: ["asset-management", "classes"],
      list: (query: string) => ["asset-management", "classes", query],
      details: (classId: string) => ["asset-management", "classes", classId],
      types: ["asset-management", "classes", "types"],
    },
    categories: {
      all: ["asset-management", "categories"],
      list: (query: string) => ["asset-management", "categories", query],
    },
    assets: {
      all: ["asset-management", "assets"],
      list: (query: string) => ["asset-management", "assets", query],
      quickSearch: (query: string, valuatorName: string, page: number) => [
        "asset-management",
        "assets",
        "quick-search",
        query,
        valuatorName,
        page,
      ],
    },
    valuationProviders: {
      all: ["asset-management", "valuation-providers"],
      list: (query: string) => ["asset-management", "valuation-providers", query],
    },
    verificationLogs: {
      all: ["asset-management", "verification-logs"],
      list: (query: string) => ["asset-management", "verification-logs", query],
      details: (logId: string) => ["asset-management", "verification-logs", logId],
    },
    customerOwnershipAggregates: {
      all: ["asset-management", "customer-ownership-aggregates"],
      list: (query: string) => ["asset-management", "customer-ownership-aggregates", query],
    },
  },

  portfolioManagement: {
    all: ["portfolio-management"],
    analytics: ["portfolio-management", "analytics"],
    inventory: {
      all: ["portfolio-management", "inventory"],
      list: (query: string) => ["portfolio-management", "inventory", query],
    },
    brands: {
      all: ["portfolio-management", "brands"],
      list: (query: string) => ["portfolio-management", "brands", query],
    },
    categories: {
      all: ["portfolio-management", "categories"],
      list: (query: string) => ["portfolio-management", "categories", query],
    },
  },

  growthMarketing: {
    all: ["growth-marketing"],
    overview: (query: string) => ["growth-marketing", "overview", query],
    metrics: (query: string) => ["growth-marketing", "metrics", query],
    customerDistribution: (query: string) => ["growth-marketing", "customer-distribution", query],
    userGrowth: (query: string) => ["growth-marketing", "user-growth", query],
  },

  marketplace: {
    all: ["marketplace"],
    analytics: (query: string) => ["marketplace", "analytics", query],
    listings: {
      all: ["marketplace", "listings"],
      list: (query: string) => ["marketplace", "listings", query],
    },
    orders: {
      all: ["marketplace", "orders"],
      list: (query: string) => ["marketplace", "orders", query],
      details: (orderId: string) => ["marketplace", "orders", orderId],
    },
  },

  customerAssets: {
    all: ["customer-assets"],
    list: (customerId: string, query: string) => ["customer-assets", customerId, query],
    aggregate: (customerId: string, assetType: string) => [
      "customer-assets",
      customerId,
      "aggregate",
      assetType,
    ],
  },

  loans: {
    all: ["loans"],
    analytics: (query: string) => ["loans", "analytics", query],
    customerList: (customerId: string, query: string) => ["loans", "customer", customerId, query],
    list: (query: string) => ["loans", query],
    details: (loanRef: string) => ["loans", loanRef],
    schedule: (loanRef: string) => ["loans", loanRef, "schedule"],
    rejectionReasons: ["loans", "rejection-reasons"],
  },

  support: {
    all: ["support"],
    tickets: {
      all: ["support", "tickets"],
      list: (query: string) => ["support", "tickets", query],
    },
    customerTickets: {
      all: ["support", "customer-tickets"],
      list: (customerId: string, query: string) => ["support", "customer-tickets", customerId, query],
    },
    passwordResetRequests: {
      all: ["support", "password-reset-requests"],
      list: (query: string) => ["support", "password-reset-requests", query],
    },
    analyticsCases: (query: string) => ["support", "analytics-cases", query],
  },

  systemSettings: {
    all: ["system-settings"],
    analytics: ["system-settings", "analytics"],

    teamMember: {
      all: ["system-settings", "team-member"],
      details: (id: string) => ["system-settings", "team-member", id],
      list: (query: string) => ["system-settings", "team-member", query],
      sessionLogs: (id: string) => ["system-settings", "team-member", id, "session-logs"],
      userActivityLog: (id: string) => ["system-settings", "team-member", id, "user-activity-log"],
    },

    roles: (query: string) => ["system-settings", "roles", query],
    permissions: ["system-settings", "permissions"],
  },

  analytics: {
    dashboard: ["analytics", "dashboard"],
  },

  riskManagement: {
    summary: ["risk-management", "summary"],
    analytics: ["risk-management", "analytics"],
  },

  payments: {
    all: ["payments"],
    analytics: (query: string) => ["payments", "analytics", query],
    assetSales: {
      list: (query: string) => ["payments", "asset-sales", query],
      details: (id: string) => ["payments", "asset-sales", id],
    },
    assetPurchases: {
      list: (query: string) => ["payments", "asset-purchases", query],
      details: (id: string) => ["payments", "asset-purchases", id],
    },
    customerDeposits: {
      list: (query: string) => ["payments", "customer-deposits", query],
      details: (id: string) => ["payments", "customer-deposits", id],
    },
    loanDisbursements: {
      list: (query: string) => ["payments", "loan-disbursements", query],
      details: (id: string) => ["payments", "loan-disbursements", id],
    },
    loansRepayments: {
      list: (query: string) => ["payments", "loans-repayments", query],
      details: (id: string) => ["payments", "loans-repayments", id],
    },
  },
};

export default keyFactory;
