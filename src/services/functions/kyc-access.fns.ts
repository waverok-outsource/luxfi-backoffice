import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import { fetchKycAccessRules } from "@/services/client/kyc-access.fns";
import KycAccessRoute from "@/services/route/kyc-access.route";
import type {
  CreateKycAccessPayload,
  KycAccessRule,
  KycAccessRuleResponse,
  UpdateKycAccessPayload,
} from "@/types/kyc.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

export type KycAccessMutationError = {
  message: string;
  status: number | null;
  /** True when the backend reports that a rule already exists for this target. */
  isDuplicate: boolean;
  /** The existing rule's `kycAccessRef`, when a duplicate was reported and could be found. */
  existingRuleId: string | null;
};

export type KycAccessMutationResult =
  | { ok: true; data: KycAccessRule }
  | { ok: false; error: KycAccessMutationError };

const DUPLICATE_PATTERN = /already exists/i;

function describeError(error: unknown): Omit<KycAccessMutationError, "existingRuleId"> {
  const message = getErrorMessage(error);
  const status = axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
  return { message, status, isDuplicate: status === 409 || DUPLICATE_PATTERN.test(message) };
}

/** Finds the rule that already covers this target, so the admin can be sent to edit it. */
async function findExistingRuleId(payload: CreateKycAccessPayload) {
  try {
    const query = convertObjectToQuery({
      targetType: payload.targetType,
      ...(payload.targetType === "resource"
        ? { resourceId: payload.resourceId }
        : { endpoint: payload.endpoint }),
      page: "1",
      limit: "1",
    });
    const response = await fetchKycAccessRules(query);
    return response.data?.[0]?.kycAccessRef ?? null;
  } catch {
    return null;
  }
}

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
    createRule: async (payload: CreateKycAccessPayload): Promise<KycAccessMutationResult> => {
      loadingFn("CREATE_RULE", true);

      try {
        const { data } = await apiHandler.post<KycAccessRuleResponse>(KycAccessRoute.rules, payload);
        await refreshRules();
        toast.success("Access rule created");
        return { ok: true, data: data.data };
      } catch (error: unknown) {
        const details = describeError(error);
        const existingRuleId = details.isDuplicate ? await findExistingRuleId(payload) : null;
        toast.error(details.message);
        return { ok: false, error: { ...details, existingRuleId } };
      } finally {
        loadingFn("CREATE_RULE", false);
      }
    },

    updateRule: async (
      ruleId: string,
      payload: UpdateKycAccessPayload,
      successMessage = "Access rule updated",
    ): Promise<KycAccessMutationResult> => {
      loadingFn("UPDATE_RULE", true);

      try {
        const { data } = await apiHandler.patch<KycAccessRuleResponse>(
          KycAccessRoute.rule(ruleId),
          payload,
        );
        await refreshRules();
        toast.success(successMessage);
        return { ok: true, data: data.data };
      } catch (error: unknown) {
        const details = describeError(error);
        toast.error(details.message);
        return { ok: false, error: { ...details, existingRuleId: null } };
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
        return data.data ?? true;
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
