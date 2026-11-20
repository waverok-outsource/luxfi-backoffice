import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import FeeRoute from "@/services/route/fee.route";
import { quoteFees } from "@/services/client/fee.fns";
import type {
  CreateFeePayload,
  FeeQuote,
  QuoteFeePayload,
  UpdateFeePayload,
} from "@/types/fee.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

type ApprovalBody = {
  message?: string;
  code?: string;
  data?: { approvalId?: string };
};

const APPROVAL_MESSAGE = "Request is awaiting approval by another authorised user";

function approvalMessage(status: number, body: ApprovalBody | undefined) {
  if (status === 202 || body?.code === "LUX001" || body?.data?.approvalId) {
    return body?.message || APPROVAL_MESSAGE;
  }
  return null;
}

const useFeeFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_FEE: false,
    UPDATE_FEE: false,
    SET_STATUS: false,
    QUOTE: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const refreshFees = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keyFactory.fees.all }),
      queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all }),
    ]);
  };

  const fns = {
    createFee: async (payload: CreateFeePayload) => {
      loadingFn("CREATE_FEE", true);
      try {
        const response = await apiHandler.post<ApprovalBody>(FeeRoute.fees, payload);
        const message = approvalMessage(response.status, response.data);
        await refreshFees();
        toast.success(message ?? "Fee created");
        return { queued: Boolean(message) };
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("CREATE_FEE", false);
      }
    },

    updateFee: async (feeId: string, payload: UpdateFeePayload) => {
      loadingFn("UPDATE_FEE", true);
      try {
        const response = await apiHandler.patch<ApprovalBody>(FeeRoute.fee(feeId), payload);
        const message = approvalMessage(response.status, response.data);
        await refreshFees();
        toast.success(message ?? "Fee updated");
        return { queued: Boolean(message) };
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("UPDATE_FEE", false);
      }
    },

    setFeeStatus: async (feeId: string, isActive: boolean) => {
      loadingFn("SET_STATUS", true);
      try {
        const response = await apiHandler.patch<ApprovalBody>(FeeRoute.status(feeId), { isActive });
        const message = approvalMessage(response.status, response.data);
        await refreshFees();
        toast.success(message ?? (isActive ? "Fee activated" : "Fee deactivated"));
        return { queued: Boolean(message) };
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("SET_STATUS", false);
      }
    },

    quoteFee: async (payload: QuoteFeePayload): Promise<FeeQuote | null> => {
      loadingFn("QUOTE", true);
      try {
        return await quoteFees(payload);
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("QUOTE", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useFeeFns;
