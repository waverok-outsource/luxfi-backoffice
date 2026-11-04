import { useQuery } from "@tanstack/react-query";

import {
  fetchKycSubmission,
  fetchKycSubmissions,
  fetchKycTier,
  fetchKycTiers,
} from "@/services/client/kyc.fns";
import keyFactory from "@/util/query-key-factory";

export const useKycTiers = (query: string) =>
  useQuery({
    queryKey: keyFactory.kyc.tiers.list(query),
    queryFn: () => fetchKycTiers(query),
  });

export const useKycTier = (kycRef: string) =>
  useQuery({
    queryKey: keyFactory.kyc.tiers.details(kycRef),
    queryFn: () => fetchKycTier(kycRef),
    enabled: Boolean(kycRef),
  });

export const useKycSubmissions = (query: string) =>
  useQuery({
    queryKey: keyFactory.kyc.submissions.list(query),
    queryFn: () => fetchKycSubmissions(query),
  });

export const useKycSubmission = (submissionId: string) =>
  useQuery({
    queryKey: keyFactory.kyc.submissions.details(submissionId),
    queryFn: () => fetchKycSubmission(submissionId),
    enabled: Boolean(submissionId),
  });
