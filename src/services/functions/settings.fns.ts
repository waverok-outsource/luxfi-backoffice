import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import SystemRoute from "@/services/route/settings.route";
import type {
  CreateRolePayloadType,
  CreateRoleResponseType,
  CreateTeamMemberPayloadType,
  CreateTeamMemberResponseType,
  StaticStatus,
  UpdateRolePayloadType,
  UpdateTeamMemberPayloadType,
  UpdateTeamMemberResponseType,
} from "@/types/settings.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useSettingsFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_ROLE: false,
    CREATE_TEAM_MEMBER: false,
    UPDATE_ROLE_DETAILS: false,
    UPDATE_ROLE_STATUS: false,
    UPDATE_TEAM_MEMBER_DETAILS: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const patchRole = async (roleId: string, payload: UpdateRolePayloadType) => {
    await apiHandler.patch<CreateRoleResponseType>(`${SystemRoute.roles}/${roleId}`, payload);
    await queryClient.invalidateQueries({ queryKey: keyFactory.systemSettings.all });
  };

  const fns = {
    createRole: async (payload: CreateRolePayloadType, callback?: () => void) => {
      loadingFn("CREATE_ROLE", true);

      try {
        await apiHandler.post<CreateRoleResponseType>(SystemRoute.roles, payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.systemSettings.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ROLE", false);
      }
    },

    createTeamMember: async (payload: CreateTeamMemberPayloadType, callback?: () => void) => {
      loadingFn("CREATE_TEAM_MEMBER", true);

      try {
        await apiHandler.post<CreateTeamMemberResponseType>(SystemRoute.teamMembers, payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.systemSettings.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_TEAM_MEMBER", false);
      }
    },

    updateTeamMemberDetails: async (
      teamMemberId: string,
      payload: UpdateTeamMemberPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_TEAM_MEMBER_DETAILS", true);

      try {
        await apiHandler.patch<UpdateTeamMemberResponseType>(
          `${SystemRoute.teamMembers}/${teamMemberId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.systemSettings.teamMember.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_TEAM_MEMBER_DETAILS", false);
      }
    },

    updateRoleDetails: async (
      roleId: string,
      payload: CreateRolePayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ROLE_DETAILS", true);

      try {
        await patchRole(roleId, payload);
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ROLE_DETAILS", false);
      }
    },

    updateRoleStatus: async (roleId: string, status: StaticStatus, callback?: () => void) => {
      loadingFn("UPDATE_ROLE_STATUS", true);

      try {
        await patchRole(roleId, { status });
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ROLE_STATUS", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useSettingsFns;
