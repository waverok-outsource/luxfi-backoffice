import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import CustomerRoute from "@/services/route/customer.route";
import type {
  BlacklistCustomerPayloadType,
  BlacklistCustomerResponseType,
  ChangeCustomerKycTierResponse,
} from "@/types/customer.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useCustomerFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    BLACKLIST_CUSTOMER: false,
    CHANGE_KYC_TIER: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    blacklistCustomer: async (
      customerId: string,
      payload: BlacklistCustomerPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("BLACKLIST_CUSTOMER", true);

      try {
        await apiHandler.post<BlacklistCustomerResponseType>(
          `${CustomerRoute.customers}/${customerId}/blacklist`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.customers.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("BLACKLIST_CUSTOMER", false);
      }
    },

    changeKycTier: async (customerId: string, tierId: string, reason?: string) => {
      loadingFn("CHANGE_KYC_TIER", true);

      try {
        const { data } = await apiHandler.put<ChangeCustomerKycTierResponse>(
          CustomerRoute.customerKycTier(customerId, tierId),
          reason?.trim() ? { reason: reason.trim() } : {},
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.customers.all });
        await queryClient.invalidateQueries({ queryKey: keyFactory.kyc.submissions.all });

        const action = data.data?.action;
        toast.success(
          action === "downgrade"
            ? "Customer moved to a lower KYC tier"
            : action === "upgrade"
              ? "Customer moved to a higher KYC tier"
              : "Customer KYC tier updated",
        );
        return true;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return false;
      } finally {
        loadingFn("CHANGE_KYC_TIER", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useCustomerFns;
