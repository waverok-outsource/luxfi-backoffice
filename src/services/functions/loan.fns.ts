import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import { uploadFiles } from "@/services/functions/upload-files";
import LoanRoute from "@/services/route/loan.route";
import type {
  ApproveLoanPayloadType,
  LoanMediaType,
  RejectLoanPayloadType,
  ReviewLoanResponseType,
  UpdateLoanMediaPayloadType,
} from "@/types/loan.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useLoanFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    REJECT_LOAN: false,
    APPROVE_LOAN: false,
    UPDATE_LOAN_MEDIA: false,
  });

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

    // Uploads any new files, then persists the full media list (existing + new) on the loan so it
    // survives reloads and stays visible after the loan is approved or rejected.
    updateLoanMedia: async (
      loanRef: string,
      existingMedia: LoanMediaType[],
      files: File[],
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_LOAN_MEDIA", true);

      try {
        const fileUrls = await uploadFiles(files);
        const uploadedAt = new Date().toISOString();
        const newMedia: LoanMediaType[] = fileUrls.map((url, index) => ({
          url,
          type: files[index].type.startsWith("video/") ? "video" : "image",
          fileName: files[index].name,
          uploadedAt,
        }));

        const payload: UpdateLoanMediaPayloadType = { media: [...existingMedia, ...newMedia] };
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.media(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_LOAN_MEDIA", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useLoanFns;
