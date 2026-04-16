export const systemSettingsTabs = [
  { label: "Team Management", value: "team-management" },
  { label: "Roles & Permission Settings", value: "roles-permission-settings" },
] as const;

export type SystemSettingsTabValue = (typeof systemSettingsTabs)[number]["value"];

export const DEFAULT_SYSTEM_SETTINGS_TAB = systemSettingsTabs[0].value;

export type TeamMemberStatus = "active" | "deactivated";

export const teamRoleOptions = [
  "Marketing Officer",
  "Compliance Officer",
  "Risk Manager",
  "Finance Manager",
  "Business Operations",
  "Operations Analyst",
] as const;

export const teamRoleDepartments: Record<(typeof teamRoleOptions)[number], string> = {
  "Marketing Officer": "Marketing",
  "Compliance Officer": "Compliance",
  "Risk Manager": "Risk",
  "Finance Manager": "Finance",
  "Business Operations": "Operations",
  "Operations Analyst": "Operations",
};

export type TeamMemberRecord = {
  id: string;
  memberId: string;
  memberName: string;
  emailAddress: string;
  assignedRole: string;
  department: string;
  dateAdded: string;
  memberSinceLabel: string;
  status: TeamMemberStatus;
};
