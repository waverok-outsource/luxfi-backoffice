const keyFactory = {
  audits: {
    all: ["audits"],
    list: (resource: string, query: string) => ["audits", resource, query],
  },

  customers: {
    all: ["customers"],
    list: (query: string) => ["customers", query],
    details: (id: string) => ["customers", id],
    sessionLogs: (id: string) => ["customers", id, "session-logs"],
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

  marketplace: {
    all: ["marketplace"],
    listings: {
      all: ["marketplace", "listings"],
      list: (query: string) => ["marketplace", "listings", query],
    },
  },

  customerAssets: {
    all: ["customer-assets"],
    list: (customerId: string, query: string) => ["customer-assets", customerId, query],
  },

  loans: {
    all: ["loans"],
    customerList: (customerId: string, query: string) => ["loans", "customer", customerId, query],
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
};

export default keyFactory;
