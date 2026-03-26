export const systemSettingsTabs = [
  { label: "Team Management", value: "team-management" },
  { label: "Roles & Permission Settings", value: "roles-permission-settings" },
] as const;

export type SystemSettingsTabValue = (typeof systemSettingsTabs)[number]["value"];

export const DEFAULT_SYSTEM_SETTINGS_TAB = systemSettingsTabs[0].value;

export const systemSettingsMetrics = [
  {
    title: "Total Team Members",
    value: "2,765",
    trend: "99.9%",
    period: "Last 7 days",
  },
  {
    title: "Total Roles",
    value: "20",
    trend: "99.9%",
    period: "Last 7 days",
  },
  {
    title: "Assigned Roles",
    value: "12",
    trend: "99.9%",
    period: "Last 7 days",
  },
] as const;

export const memberPresence = {
  online: {
    label: "Members Online",
    value: "2,654",
    share: 75,
  },
  offline: {
    label: "Members Offline",
    value: "210",
    share: 25,
  },
} as const;

export type TeamMemberStatus = "active" | "deactivated";

export type TeamMemberRecord = {
  id: string;
  memberId: string;
  memberName: string;
  emailAddress: string;
  assignedRole: string;
  dateAdded: string;
  status: TeamMemberStatus;
};

export const TEAM_MANAGEMENT_TOTAL_ENTRIES = 1000;

export const teamMembers: TeamMemberRecord[] = [
  {
    id: "tm-1",
    memberId: "8909554221",
    memberName: "Dare Abdullahi",
    emailAddress: "dare.abdullahi@pawnshopbyblu.com",
    assignedRole: "Marketing Officer",
    dateAdded: "10 - 01 - 2026",
    status: "active",
  },
  {
    id: "tm-2",
    memberId: "8909554222",
    memberName: "Oreoluwa Akinnagbe",
    emailAddress: "oreoluwa.akinnagbe@pawnshopbyblu.com",
    assignedRole: "Compliance Officer",
    dateAdded: "10 - 01 - 2026",
    status: "deactivated",
  },
  {
    id: "tm-3",
    memberId: "8909554223",
    memberName: "John Ndubuisi",
    emailAddress: "johndubuisi@pawnshopbyblu.com",
    assignedRole: "Risk Manager",
    dateAdded: "10 - 01 - 2026",
    status: "active",
  },
  {
    id: "tm-4",
    memberId: "8909554224",
    memberName: "Hannah Amarachi",
    emailAddress: "hannahamarachi@pawnshopbyblu.com",
    assignedRole: "Finance Manager",
    dateAdded: "10 - 01 - 2026",
    status: "active",
  },
  {
    id: "tm-5",
    memberId: "8909554225",
    memberName: "Fred Bassey",
    emailAddress: "fred.bassey@pawnshopbyblu.com",
    assignedRole: "Business Operations",
    dateAdded: "10 - 01 - 2026",
    status: "active",
  },
];

export type RolePermissionStatus = "active" | "draft";

export type RolePermissionRecord = {
  id: string;
  roleName: string;
  accessScope: string;
  assignedMembers: number;
  permissionsSummary: string;
  lastUpdated: string;
  status: RolePermissionStatus;
};

export const rolePermissionSettings: RolePermissionRecord[] = [
  {
    id: "rp-1",
    roleName: "Finance Manager",
    accessScope: "Treasury and settlements",
    assignedMembers: 3,
    permissionsSummary: "Wallet approvals, settlements, reconciliations",
    lastUpdated: "22 - 03 - 2026",
    status: "active",
  },
  {
    id: "rp-2",
    roleName: "Compliance Officer",
    accessScope: "KYC and customer reviews",
    assignedMembers: 4,
    permissionsSummary: "KYC review, document access, escalation queue",
    lastUpdated: "18 - 03 - 2026",
    status: "active",
  },
  {
    id: "rp-3",
    roleName: "Risk Manager",
    accessScope: "Credit and exposure controls",
    assignedMembers: 2,
    permissionsSummary: "LTV overrides, liquidation rules, risk reports",
    lastUpdated: "14 - 03 - 2026",
    status: "active",
  },
  {
    id: "rp-4",
    roleName: "Operations Analyst",
    accessScope: "Workflow operations",
    assignedMembers: 5,
    permissionsSummary: "Case routing, queue management, audit visibility",
    lastUpdated: "09 - 03 - 2026",
    status: "draft",
  },
];
