const keyFactory = {
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
