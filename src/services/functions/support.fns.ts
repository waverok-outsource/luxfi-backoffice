import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import SupportRoute from "@/services/route/support.route";
import type {
  ResetPasswordRequestResponseType,
  ReviewSupportTicketPayloadType,
  ReviewSupportTicketResponseType,
} from "@/types/support.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useSupportFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    REVIEW_TICKET: false,
    RESET_PASSWORD_REQUEST: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    reviewTicket: async (
      ticketRef: string,
      payload: ReviewSupportTicketPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("REVIEW_TICKET", true);

      try {
        // ASSUMPTION: request body not sampled by backend — sending { status }
        // matches the binary toggle the UI already has. See ADR 0019.
        await apiHandler.patch<ReviewSupportTicketResponseType>(
          `${SupportRoute.tickets}/${ticketRef}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.support.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REVIEW_TICKET", false);
      }
    },

    resetPasswordRequest: async (requestRef: string, callback?: () => void) => {
      loadingFn("RESET_PASSWORD_REQUEST", true);

      try {
        await apiHandler.post<ResetPasswordRequestResponseType>(
          `${SupportRoute.passwordResetRequests}/${requestRef}`,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.support.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("RESET_PASSWORD_REQUEST", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useSupportFns;
