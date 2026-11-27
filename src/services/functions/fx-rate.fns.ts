import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import apiHandler from "@/services/api-handler";
import { fetchFxQuote } from "@/services/client/fx-rate.fns";
import FxRateRoute from "@/services/route/fx-rate.route";
import type { FxQuote, FxQuoteQuery, SetFxRatePayload } from "@/types/fx-rate.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

type MakerCheckerBody = {
  status?: string;
  code?: string;
  message?: string;
  data?: { approvalId?: string; status?: string; expiresAt?: string };
};

export type SetFxRateResult =
  | { kind: "pending"; approvalId: string | null; message: string }
  | { kind: "applied"; message: string }
  | { kind: "error"; message: string };

export type FxQuoteResult = { kind: "ok"; quote: FxQuote } | { kind: "error"; message: string };

const useFxRateFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({ SET_RATE: false, QUOTE: false });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    /**
     * Maker-checker. 202 = queued for another authorised user (not success, not error).
     * 200 only happens on the approved replay path. Errors are returned, not toasted,
     * so the form can show the backend message inline.
     */
    setFxRate: async (payload: SetFxRatePayload): Promise<SetFxRateResult> => {
      loadingFn("SET_RATE", true);
      try {
        const response = await apiHandler.post<MakerCheckerBody>(FxRateRoute.rates, payload);
        const body = response.data;

        if (response.status === 202 || body?.status === "pending" || body?.code === "LUX001") {
          await queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all });
          return {
            kind: "pending",
            approvalId: body?.data?.approvalId ?? null,
            message: body?.message || "Request is awaiting approval by another authorised user",
          };
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: keyFactory.fxRates.all }),
          queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all }),
        ]);
        return { kind: "applied", message: body?.message || "Rate set" };
      } catch (error: unknown) {
        return { kind: "error", message: getErrorMessage(error) };
      } finally {
        loadingFn("SET_RATE", false);
      }
    },

    quoteFx: async (query: FxQuoteQuery): Promise<FxQuoteResult> => {
      loadingFn("QUOTE", true);
      try {
        return { kind: "ok", quote: await fetchFxQuote(query) };
      } catch (error: unknown) {
        return { kind: "error", message: getErrorMessage(error) };
      } finally {
        loadingFn("QUOTE", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useFxRateFns;
