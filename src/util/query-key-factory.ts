const keyFactory = {
  systemSettings: {
    all: ["system-settings"],
    analytics: (query: string) => ["system-settings", "analytics", query],

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
