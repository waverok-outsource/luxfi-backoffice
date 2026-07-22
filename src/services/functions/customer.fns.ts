import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import CustomerRoute from "@/services/route/customer.route";
import type {
  BlacklistCustomerPayloadType,
  BlacklistCustomerResponseType,
} from "@/types/customer.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useCustomerFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    BLACKLIST_CUSTOMER: false,
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
  };

  return { ...fns, loading };
};

export default useCustomerFns;
