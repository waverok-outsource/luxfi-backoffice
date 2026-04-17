import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalytics,
  fetchPermissions,
  fetchRoles,
  fetchTeamMember,
  fetchTeamMembers,
  fetchTeamMemberActivityLogs,
  fetchTeamMemberSessionLogs,
} from "@/services/client/settings.fns";
import keyFactory from "@/util/query-key-factory";

export const useSettingsAnalytics = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.systemSettings.analytics(query),
    queryFn: () => fetchAnalytics(query),
  });

export const useSettingsTeamMembers = (query: string) =>
  useQuery({
    queryKey: keyFactory.systemSettings.teamMember.list(query),
    queryFn: () => fetchTeamMembers(query),
  });

export const useSettingsTeamMember = (id: string) =>
  useQuery({
    queryKey: keyFactory.systemSettings.teamMember.details(id),
    queryFn: () => fetchTeamMember(id),
    enabled: !!id,
  });

export const useSettingsRoles = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.systemSettings.roles(query),
    queryFn: () => fetchRoles(query),
  });

export const useSettingsPermissions = () =>
  useQuery({
    queryKey: keyFactory.systemSettings.permissions,
    queryFn: fetchPermissions,
  });

export const useSettingsTeamMemberSessionLogs = (memberId: string, query: string) =>
  useQuery({
    queryKey: [...keyFactory.systemSettings.teamMember.sessionLogs(memberId), query],
    queryFn: () => fetchTeamMemberSessionLogs(memberId, query),
    enabled: Boolean(memberId),
  });

export const useSettingsTeamMemberActivityLogs = (memberId: string, query: string) =>
  useQuery({
    queryKey: [...keyFactory.systemSettings.teamMember.userActivityLog(memberId), query],
    queryFn: () => fetchTeamMemberActivityLogs(memberId, query),
    enabled: Boolean(memberId),
  });
