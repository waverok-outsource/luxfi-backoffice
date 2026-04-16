import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalytics,
  fetchPermissions,
  fetchRoles,
  fetchTeamMember,
  fetchTeamMembers,
} from "@/services/client/settings.fns";
import keyFactory from "@/util/query-key-factory";

export const useSettingsAnalytics = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.systemSettings.analytics(query),
    queryFn: () => fetchAnalytics(query),
  });

export const useSettingsTeamMembers = (query: string) =>
  useQuery({
    queryKey: keyFactory.systemSettings.teamMembers(query),
    queryFn: () => fetchTeamMembers(query),
  });

export const useSettingsTeamMember = (id: string) =>
  useQuery({
    queryKey: keyFactory.systemSettings.teamMember(id),
    queryFn: () => fetchTeamMember(id),
    enabled: Boolean(id),
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
