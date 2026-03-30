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

export const TEAM_MANAGEMENT_TOTAL_ENTRIES = 1000;

export const teamMembers: TeamMemberRecord[] = [
  {
    id: "CU802725424233",
    memberId: "8909554221",
    memberName: "Dare Abdullahi",
    emailAddress: "dare.abdullahi@pawnshopbyblu.com",
    assignedRole: "Marketing Officer",
    department: "Marketing",
    dateAdded: "10 - 01 - 2026",
    memberSinceLabel: "10 January, 2026",
    status: "active",
  },
  {
    id: "CU802725424234",
    memberId: "8909554222",
    memberName: "Oreoluwa Akinnagbe",
    emailAddress: "oreoluwa.akinnagbe@pawnshopbyblu.com",
    assignedRole: "Compliance Officer",
    department: "Compliance",
    dateAdded: "10 - 01 - 2026",
    memberSinceLabel: "10 January, 2026",
    status: "deactivated",
  },
  {
    id: "CU802725424235",
    memberId: "8909554223",
    memberName: "John Ndubuisi",
    emailAddress: "johndubuisi@pawnshopbyblu.com",
    assignedRole: "Risk Manager",
    department: "Risk",
    dateAdded: "10 - 01 - 2026",
    memberSinceLabel: "10 January, 2026",
    status: "active",
  },
  {
    id: "CU802725424236",
    memberId: "8909554224",
    memberName: "Hannah Amarachi",
    emailAddress: "hannahamarachi@pawnshopbyblu.com",
    assignedRole: "Finance Manager",
    department: "Finance",
    dateAdded: "10 - 01 - 2026",
    memberSinceLabel: "10 January, 2026",
    status: "active",
  },
  {
    id: "CU802725424237",
    memberId: "8909554225",
    memberName: "Fred Bassey",
    emailAddress: "fred.bassey@pawnshopbyblu.com",
    assignedRole: "Business Operations",
    department: "Operations",
    dateAdded: "10 - 01 - 2026",
    memberSinceLabel: "10 January, 2026",
    status: "active",
  },
];

export const rolePermissionModules = [
  { key: "dashboard", label: "Dashboard" },
  { key: "customers", label: "Customers" },
  { key: "kycCompliance", label: "KYC & Compliance" },
  { key: "portfolioManagement", label: "Portfolio Management" },
  { key: "loansSmartContracts", label: "Loans & Smart Contracts" },
  { key: "riskManagement", label: "Risk Management" },
  { key: "paymentsSettlements", label: "Payments & Settlements" },
  { key: "growthMarketing", label: "Growth & Marketing" },
  { key: "helpSupport", label: "Help & Support" },
  { key: "systemSettings", label: "System Settings" },
] as const;

export type RolePermissionModuleKey = (typeof rolePermissionModules)[number]["key"];

export type RolePermissionStatus = "active" | "deactivated";

export type RolePermissionAccess = {
  moduleKey: RolePermissionModuleKey;
  moduleLabel: string;
  viewerOnly: boolean;
  initiatorApprover: boolean;
};

export type RolePermissionRecord = {
  id: string;
  roleId: string;
  roleTag: string;
  permissions: number;
  dateAdded: string;
  status: RolePermissionStatus;
  access: RolePermissionAccess[];
};

export function createRolePermissionAccess(
  selection: Partial<Record<RolePermissionModuleKey, "viewerOnly" | "initiatorApprover">> = {},
): RolePermissionAccess[] {
  return rolePermissionModules.map((module) => {
    const value = selection[module.key];

    return {
      moduleKey: module.key,
      moduleLabel: module.label,
      viewerOnly: value === "viewerOnly",
      initiatorApprover: value === "initiatorApprover",
    };
  });
}

export const rolePermissionSettings: RolePermissionRecord[] = [
  {
    id: "8909554221",
    roleId: "8909554221",
    roleTag: "Marketing Officer",
    permissions: 10,
    dateAdded: "10 - 01 - 2026",
    status: "active",
    access: createRolePermissionAccess({
      dashboard: "initiatorApprover",
      customers: "initiatorApprover",
      kycCompliance: "viewerOnly",
      portfolioManagement: "viewerOnly",
      loansSmartContracts: "initiatorApprover",
      riskManagement: "initiatorApprover",
      paymentsSettlements: "initiatorApprover",
      growthMarketing: "viewerOnly",
      helpSupport: "viewerOnly",
      systemSettings: "viewerOnly",
    }),
  },
  {
    id: "8909554222",
    roleId: "8909554222",
    roleTag: "Compliance Officer",
    permissions: 8,
    dateAdded: "10 - 01 - 2026",
    status: "deactivated",
    access: createRolePermissionAccess({
      dashboard: "viewerOnly",
      customers: "initiatorApprover",
      kycCompliance: "initiatorApprover",
      portfolioManagement: "viewerOnly",
      riskManagement: "initiatorApprover",
      paymentsSettlements: "viewerOnly",
      helpSupport: "viewerOnly",
      systemSettings: "viewerOnly",
    }),
  },
  {
    id: "8909554223",
    roleId: "8909554223",
    roleTag: "Risk Manager",
    permissions: 7,
    dateAdded: "10 - 01 - 2026",
    status: "active",
    access: createRolePermissionAccess({
      dashboard: "initiatorApprover",
      customers: "viewerOnly",
      kycCompliance: "viewerOnly",
      loansSmartContracts: "initiatorApprover",
      riskManagement: "initiatorApprover",
      paymentsSettlements: "viewerOnly",
      systemSettings: "viewerOnly",
    }),
  },
  {
    id: "8909554224",
    roleId: "8909554224",
    roleTag: "Finance Manager",
    permissions: 10,
    dateAdded: "10 - 01 - 2026",
    status: "active",
    access: createRolePermissionAccess({
      dashboard: "initiatorApprover",
      customers: "initiatorApprover",
      kycCompliance: "viewerOnly",
      portfolioManagement: "viewerOnly",
      loansSmartContracts: "initiatorApprover",
      riskManagement: "initiatorApprover",
      paymentsSettlements: "initiatorApprover",
      growthMarketing: "viewerOnly",
      helpSupport: "viewerOnly",
      systemSettings: "viewerOnly",
    }),
  },
  {
    id: "8909554225",
    roleId: "8909554225",
    roleTag: "Business Operations",
    permissions: 8,
    dateAdded: "10 - 01 - 2026",
    status: "active",
    access: createRolePermissionAccess({
      dashboard: "viewerOnly",
      customers: "initiatorApprover",
      portfolioManagement: "initiatorApprover",
      loansSmartContracts: "viewerOnly",
      riskManagement: "viewerOnly",
      paymentsSettlements: "initiatorApprover",
      growthMarketing: "viewerOnly",
      helpSupport: "viewerOnly",
    }),
  },
];
