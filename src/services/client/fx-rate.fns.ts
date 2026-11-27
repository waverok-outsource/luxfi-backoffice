import apiHandler from "@/services/api-handler";
import FxRateRoute from "@/services/route/fx-rate.route";
import type {
  FxQuoteQuery,
  FxQuoteResponse,
  FxRate,
  FxRateHistoryQuery,
  FxRatesResponse,
} from "@/types/fx-rate.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";

function asId(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return id == null ? "" : String(id);
  }
  return "";
}

// Keep `rate` as the exact string the API sent. Never coerce it through Number.
function normalizeFxRate(raw: FxRate): FxRate {
  return {
    ...raw,
    rate: String(raw.rate ?? ""),
    setBy: asId(raw.setBy) || null,
    note: raw.note ?? null,
  };
}

export const fetchFxRates = async () => {
  const { data } = await apiHandler.get<FxRatesResponse>(FxRateRoute.rates);
  return { ...data, data: (data.data ?? []).map(normalizeFxRate) };
};

export const fetchFxRateHistory = async ({ base, quote, purpose, limit = 50 }: FxRateHistoryQuery) => {
  const query = convertObjectToQuery({ base, quote, purpose, limit: String(limit) });
  const { data } = await apiHandler.get<FxRatesResponse>(`${FxRateRoute.history}?${query}`);
  return { ...data, data: (data.data ?? []).map(normalizeFxRate) };
};

export const fetchFxQuote = async ({ from, to, amount, purpose }: FxQuoteQuery) => {
  const query = convertObjectToQuery({ from, to, amount, purpose });
  const { data } = await apiHandler.get<FxQuoteResponse>(`${FxRateRoute.quote}?${query}`);
  return data.data;
};
