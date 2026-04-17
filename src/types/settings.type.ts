import { ApiResponse, PaginatedApiResponse } from "./global";

export type SettingsAnalyticsGrowthPattern = "upward" | "downward";

export type SettingsAnalyticsMetricType = {
  value: number;
  growth: string;
  growthDuration: string;
  growthPattern: SettingsAnalyticsGrowthPattern;
};

export type TeamMembersAnalyticsType = SettingsAnalyticsMetricType & {
  online: number;
  offline: number;
};

export type SettingsAnalyticsType = {
  teamMembers: TeamMembersAnalyticsType;
  roles: SettingsAnalyticsMetricType;
  assignedRoles: SettingsAnalyticsMetricType;
};

export type SettingsAnalyticsResponseType = ApiResponse<SettingsAnalyticsType>;

export type StaticStatus = "active" | "inactive" | "blacklist" | "locked" | "deactivate";

export type SettingsTeamMemberType = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  roleTitle: string;
  accountStatus: StaticStatus;
  roleId: string;
  userRef: string;
  userId: string;
};

export type SettingsTeamMembersResponseType = PaginatedApiResponse<SettingsTeamMemberType[]>;

export type SettingsRolePermissionType = {
  title: string;
  id: string;
};

export type SettingsPermissionType = SettingsRolePermissionType & {
  description: string;
  forAdmin: boolean;
  createdAt: string;
};

export type SettingsPermissionResourceType = {
  resourceTitle: string;
  resourceDescription: string;
  permissions: SettingsPermissionType[];
  resourceId: string;
};

export type SettingsRoleType = {
  title: string;
  permissions: SettingsRolePermissionType[];
  status: StaticStatus;
  permissionsCount: number;
  createdAt: string;
  roleId: string;
};

export type SettingsRolesResponseType = PaginatedApiResponse<SettingsRoleType[]>;

export type SettingsPermissionsResponseType = ApiResponse<SettingsPermissionResourceType[]>;

export type CreateRolePayloadType = {
  title: string;
  permissions: string[];
};

export type UpdateRolePayloadType = Partial<CreateRolePayloadType> & {
  status?: StaticStatus;
};

export type CreateRoleResponseType = ApiResponse<SettingsRoleType>;

export type CreateTeamMemberPayloadType = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type CreateTeamMemberResponseType = ApiResponse<SettingsTeamMemberType>;

export type UpdateTeamMemberPayloadType = Partial<CreateTeamMemberPayloadType> & {
  status?: StaticStatus;
};

export type UpdateTeamMemberResponseType = ApiResponse<SettingsTeamMemberType>;

export type SettingsTeamMemberSessionLogLocationType = {
  city: string;
  country: string;
};

export type SettingsTeamMemberSessionLogType = {
  ipAddress: string;
  device: string;
  deviceModel: string;
  channel: string;
  location: SettingsTeamMemberSessionLogLocationType;
  activity: string;
  createdAt: string;
  sessionLogId: string;
};

export type SettingsTeamMemberSessionLogsResponseType = PaginatedApiResponse<
  SettingsTeamMemberSessionLogType[]
>;

export type SettingsTeamMemberActivityLogType = {
  message: string;
  status: string;
  event: string;
  eventTag: string;
  resource: string;
  ip: string;
  maker: string;
  userId: string;
  createdAt: string;
  logId: string;
  initiatorName: string;
};

export type SettingsTeamMemberActivityLogsResponseType = PaginatedApiResponse<
  SettingsTeamMemberActivityLogType[]
>;
