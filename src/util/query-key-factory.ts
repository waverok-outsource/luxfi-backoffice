const keyFactory = {
  systemSettings: {
    all: ["system-settings"],
    analytics: (query: string) => ["system-settings", "analytics", query],
    teamMembers: (query: string) => ["system-settings", "team-members", query],
    teamMember: (id: string) => ["system-settings", "team-member", id],
    roles: (query: string) => ["system-settings", "roles", query],
    permissions: ["system-settings", "permissions"],
  },
};

export default keyFactory;
