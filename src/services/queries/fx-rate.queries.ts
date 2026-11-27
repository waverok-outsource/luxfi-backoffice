import { useQuery } from "@tanstack/react-query";

import { fetchFxRateHistory, fetchFxRates } from "@/services/client/fx-rate.fns";
import type { FxRateHistoryQuery } from "@/types/fx-rate.type";
import keyFactory from "@/util/query-key-factory";

export const useFxRates = () =>
  useQuery({
    queryKey: keyFactory.fxRates.current,
    queryFn: fetchFxRates,
    // Staleness is time-based on the server; refetch so the badge flips without a reload.
    refetchInterval: 5 * 60 * 1000,
  });

export const useFxRateHistory = (params: FxRateHistoryQuery | null) =>
  useQuery({
    queryKey: keyFactory.fxRates.history(
      params?.base ?? "",
      params?.quote ?? "",
      params?.purpose ?? "",
      params?.limit ?? 50,
    ),
    queryFn: () => fetchFxRateHistory(params!),
    enabled: Boolean(params),
  });
