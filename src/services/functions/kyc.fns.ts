import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import KycRoute from "@/services/route/kyc.route";
import type {
  KycSubmissionResponse,
  KycTierPayload,
  KycTierResponse,
  ReviewSubmissionPayload,
  UpdateSubmissionRequirementPayload,
  VerifyRequirementPayload,
  VerifyRequirementResponse,
} from "@/types/kyc.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useKycFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    SAVE_TIER: false,
    UPDATE_REQUIREMENT: false,
    REVIEW_SUBMISSION: false,
    VERIFY_REQUIREMENT: false,
    REVEAL_SUBMISSION: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const refreshKyc = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keyFactory.kyc.all }),
      queryClient.invalidateQueries({ queryKey: keyFactory.customers.kycTiers.all }),
    ]);
  };

  const fns = {
    saveTier: async (payload: KycTierPayload, kycRef?: string) => {
      loadingFn("SAVE_TIER", true);

      try {
        const response = kycRef
          ? await apiHandler.patch<KycTierResponse>(KycRoute.tier(kycRef), payload)
          : await apiHandler.post<KycTierResponse>(KycRoute.tiers, payload);

        await refreshKyc();
        toast.success(kycRef ? "KYC tier updated" : "KYC tier created");
        return response.data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("SAVE_TIER", false);
      }
    },

    updateRequirement: async (
      submissionId: string,
      payload: UpdateSubmissionRequirementPayload,
    ) => {
      loadingFn("UPDATE_REQUIREMENT", true);

      try {
        const { data } = await apiHandler.patch<KycSubmissionResponse>(
          KycRoute.submission(submissionId),
          payload,
        );
        await queryClient.invalidateQueries({ queryKey: keyFactory.kyc.submissions.all });
        toast.success(`${payload.name} marked ${payload.status}`);
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("UPDATE_REQUIREMENT", false);
      }
    },

    reviewSubmission: async (submissionId: string, payload: ReviewSubmissionPayload) => {
      loadingFn("REVIEW_SUBMISSION", true);

      try {
        const { data } = await apiHandler.post<KycSubmissionResponse>(
          KycRoute.reviewSubmission(submissionId),
          payload,
        );
        await queryClient.invalidateQueries({ queryKey: keyFactory.kyc.submissions.all });
        toast.success(payload.status === "approved" ? "Submission approved" : "Submission rejected");
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("REVIEW_SUBMISSION", false);
      }
    },

    verifyRequirement: async (payload: VerifyRequirementPayload) => {
      loadingFn("VERIFY_REQUIREMENT", true);

      try {
        const { data } = await apiHandler.post<VerifyRequirementResponse>(KycRoute.verify, {
          ...payload,
          autoUpdate: payload.autoUpdate ?? true,
        });
        await queryClient.invalidateQueries({ queryKey: keyFactory.kyc.submissions.all });
        const result = data.data;
        toast.success(result.statusText || `${result.requirement} checked`);
        return result;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("VERIFY_REQUIREMENT", false);
      }
    },

    revealSubmission: async (submissionId: string, password: string) => {
      loadingFn("REVEAL_SUBMISSION", true);

      try {
        const { data } = await apiHandler.post<KycSubmissionResponse>(
          KycRoute.revealSubmission(submissionId),
          { password },
        );
        return data.data;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return null;
      } finally {
        loadingFn("REVEAL_SUBMISSION", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useKycFns;
