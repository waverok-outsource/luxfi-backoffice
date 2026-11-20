import { useQuery } from "@tanstack/react-query";

import { fetchFee, fetchFeeOptions, fetchFees } from "@/services/client/fee.fns";
import keyFactory from "@/util/query-key-factory";

export const useFees = (query: string) =>
  useQuery({
    queryKey: keyFactory.fees.list(query),
    queryFn: () => fetchFees(query),
  });

export const useFee = (feeId: string) =>
  useQuery({
    queryKey: keyFactory.fees.details(feeId),
    queryFn: () => fetchFee(feeId),
    enabled: Boolean(feeId),
  });

export const useFeeOptions = () =>
  useQuery({
    queryKey: keyFactory.fees.options,
    queryFn: fetchFeeOptions,
    staleTime: 5 * 60 * 1000,
  });
