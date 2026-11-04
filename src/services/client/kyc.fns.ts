import apiHandler from "@/services/api-handler";
import KycRoute from "@/services/route/kyc.route";
import type {
  KycSubmissionResponse,
  KycSubmissionsResponse,
  KycTierResponse,
  KycTiersResponse,
} from "@/types/kyc.type";

export const fetchKycTiers = async (query = "") => {
  const { data } = await apiHandler.get<KycTiersResponse>(
    `${KycRoute.tiers}${query ? `?${query}` : ""}`,
  );
  return data;
};

export const fetchKycTier = async (kycRef: string) => {
  const { data } = await apiHandler.get<KycTierResponse>(KycRoute.tier(kycRef));
  return data;
};

export const fetchKycSubmissions = async (query = "") => {
  const { data } = await apiHandler.get<KycSubmissionsResponse>(
    `${KycRoute.submissions}${query ? `?${query}` : ""}`,
  );
  return data;
};

export const fetchKycSubmission = async (submissionId: string) => {
  const { data } = await apiHandler.get<KycSubmissionResponse>(KycRoute.submission(submissionId));
  return data;
};
