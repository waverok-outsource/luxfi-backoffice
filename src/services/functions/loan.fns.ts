import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import LoanRoute from "@/services/route/loan.route";
import type {
  ApproveLoanPayloadType,
  RejectLoanPayloadType,
  ReviewLoanResponseType,
} from "@/types/loan.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useLoanFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({ REJECT_LOAN: false, APPROVE_LOAN: false });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    rejectLoan: async (loanRef: string, payload: RejectLoanPayloadType, callback?: () => void) => {
      loadingFn("REJECT_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.reject(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REJECT_LOAN", false);
      }
    },

    approveLoan: async (
      loanRef: string,
      payload: ApproveLoanPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("APPROVE_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.approve(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("APPROVE_LOAN", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useLoanFns;
