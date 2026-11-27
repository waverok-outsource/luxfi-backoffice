import type { ApiResponse } from "@/types/global";

export const FIAT_CURRENCIES = [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "GHS",
  "KES",
  "ZAR",
  "UGX",
  "XOF",
  "XAF",
] as const;

export const CRYPTO_CURRENCIES = ["USDT", "USDC", "BTC", "SOL", "ETH"] as const;

export const FX_CURRENCIES = [...FIAT_CURRENCIES, ...CRYPTO_CURRENCIES] as const;

export type FxCurrency = (typeof FX_CURRENCIES)[number];

export const FX_RATE_PURPOSES = ["payout", "collection"] as const;

export type FxRatePurpose = (typeof FX_RATE_PURPOSES)[number];

/** Same pattern the backend validates. Rates stay decimal strings end to end. */
export const FX_RATE_PATTERN = /^(0|[1-9]\d{0,11})(\.\d{1,10})?$/;

export const FX_NOTE_MAX_LENGTH = 300;

/** Above this % change against the current rate, the form asks for a second confirmation. */
export const FX_RATE_CHANGE_CONFIRM_THRESHOLD = 5;

/** "rate" units of `quote` per 1 unit of `base`. */
export type FxRate = {
  _id: string;
  base: string;
  quote: string;
  rate: string;
  purpose: FxRatePurpose;
  note?: string | null;
  setBy?: string | null;
  createdAt: string;
  updatedAt?: string;
  /** Only on GET /v1/fx-rates. Absent on history rows. */
  stale?: boolean;
};

export type FxMoney = {
  value: number;
  exact?: string;
  currencyCode: string;
};

export type FxQuote = {
  source: FxMoney;
  target: FxMoney;
  rate: string;
  purpose: FxRatePurpose;
  rateId: string;
  rateSetAt: string;
  stale: boolean;
  converted: boolean;
  quotedAt: string;
};

export type SetFxRatePayload = {
  base: string;
  quote: string;
  rate: string;
  purpose: FxRatePurpose;
  note?: string;
};

export type FxRateHistoryQuery = {
  base: string;
  quote: string;
  purpose: FxRatePurpose;
  limit?: number;
};

export type FxQuoteQuery = {
  from: string;
  to: string;
  amount: string;
  purpose: FxRatePurpose;
};

export type FxRatesResponse = ApiResponse<FxRate[]>;
export type FxQuoteResponse = ApiResponse<FxQuote>;

export function isCryptoCurrency(code: string) {
  return (CRYPTO_CURRENCIES as readonly string[]).includes(code);
}
