import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import KycAccessRoute from "@/services/route/kyc-access.route";
import type {
  CreateKycAccessPayload,
  KycAccessRuleResponse,
  UpdateKycAccessPayload,
} from "@/types/kyc.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useKycAccessFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_RULE: false,
    UPDATE_RULE: false,
    DELETE_RULE: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const refreshRules = async () => {
    await queryClient.invalidateQueries({ queryKey: keyFactory.kyc.access.all });
  };

  const fns = {
    createRule: async (payload: CreateKycAccessPayload) => {
      loadingFn("CREATE_RULE", true);

      try {
        const { data } = await apiHandler.post<KycAccessRuleResponse>(KycAccessRoute.rules, payload);
        await refreshRules();
        toast.success("Access rule created");
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("CREATE_RULE", false);
      }
    },

    updateRule: async (
      ruleId: string,
      payload: UpdateKycAccessPayload,
      successMessage = "Access rule updated",
    ) => {
      loadingFn("UPDATE_RULE", true);

      try {
        const { data } = await apiHandler.patch<KycAccessRuleResponse>(
          KycAccessRoute.rule(ruleId),
          payload,
        );
        await refreshRules();
        toast.success(successMessage);
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("UPDATE_RULE", false);
      }
    },

    deleteRule: async (ruleId: string) => {
      loadingFn("DELETE_RULE", true);

      try {
        const { data } = await apiHandler.delete<KycAccessRuleResponse>(KycAccessRoute.rule(ruleId));
        await refreshRules();
        toast.success("Access rule deleted");
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("DELETE_RULE", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useKycAccessFns;
