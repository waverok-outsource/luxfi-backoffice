import { ApiResponse } from "@/types/global";
import {
  SettingsAnalyticsType,
  SettingsPermissionsResponseType,
  SettingsRolesResponseType,
  SettingsTeamMembersResponseType,
  SettingsTeamMemberType,
  SettingsTeamMemberActivityLogsResponseType,
  SettingsTeamMemberSessionLogsResponseType,
} from "@/types/settings.type";
import apiHandler from "../api-handler";
import SystemRoute from "../route/settings.route";

export const fetchAnalytics = async (query: string = "") => {
  const { data } = await apiHandler.get<ApiResponse<SettingsAnalyticsType>>(
    `${SystemRoute.analytics}${query ? `?${query}` : ""}`,
  );

  return data.data;
};

export const fetchTeamMembers = async (query: string) => {
  const { data } = await apiHandler.get<SettingsTeamMembersResponseType>(
    `${SystemRoute.teamMembers}?userType=platform${query ? `&${query}` : ""}`,
  );

  return data;
};

export const fetchTeamMember = async (id: string) => {
  const { data } = await apiHandler.get<ApiResponse<SettingsTeamMemberType>>(
    `${SystemRoute.teamMembers}/${id}`,
  );

  return data;
};

export const fetchRoles = async (query: string) => {
  const { data } = await apiHandler.get<SettingsRolesResponseType>(
    `${SystemRoute.roles}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchPermissions = async () => {
  const { data } = await apiHandler.get<SettingsPermissionsResponseType>(SystemRoute.permissions);

  return data;
};

export const fetchTeamMemberSessionLogs = async (id: string, query = "") => {
  const { data } = await apiHandler.get<SettingsTeamMemberSessionLogsResponseType>(
    `${SystemRoute.teamMembers}/${id}/session-logs${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchTeamMemberActivityLogs = async (id: string, query = "") => {
  const { data } = await apiHandler.get<SettingsTeamMemberActivityLogsResponseType>(
    `${SystemRoute.teamMembers}/${id}/activities${query ? `?${query}` : ""}`,
  );

  return data;
};
