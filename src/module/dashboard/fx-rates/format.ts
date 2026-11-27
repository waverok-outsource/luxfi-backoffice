import { formatDistanceToNowStrict } from "date-fns";

import type { FxMoney, FxRatePurpose } from "@/types/fx-rate.type";

import { FX_RATE_PATTERN, isCryptoCurrency } from "@/types/fx-rate.type";
import { formatDate } from "@/util/helper";

/**
 * Adds thousands separators to a decimal string without going through a float,
 * so "1550.2500" stays "1,550.2500". Anything that is not a plain decimal is returned as-is.
 */
export function formatDecimalString(value: string) {
  const trimmed = value.trim();
  const match = /^(-?)(\d+)(\.\d+)?$/.exec(trimmed);
  if (!match) return trimmed;
  const [, sign, integer, fraction = ""] = match;
  return `${sign}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${fraction}`;
}

export function currencySymbol(code: string) {
  if (isCryptoCurrency(code)) return null;
  try {
    const part = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((item) => item.type === "currency")?.value;
    // "F CFA" and similar multi-word symbols read badly as a prefix; use the code suffix instead.
    return part && part !== code && !/\s/.test(part) ? part : null;
  } catch {
    return null;
  }
}

/** "₦1,550.25" when the currency has a symbol, otherwise "1,550.25 USDT". */
export function withCurrency(formattedAmount: string, code: string) {
  const symbol = currencySymbol(code);
  return symbol ? `${symbol}${formattedAmount}` : `${formattedAmount} ${code}`;
}

/** Table form: "1 USD = 1,550.25 NGN". */
export function describeRate(base: string, quote: string, rate: string) {
  return `1 ${base} = ${formatDecimalString(rate)} ${quote}`;
}

export function pairLabel(base: string, quote: string) {
  return `${base} → ${quote}`;
}

export function purposeLabel(purpose: FxRatePurpose | string) {
  return purpose === "collection" ? "Collection" : "Payout";
}

export function isValidRate(value: string) {
  return FX_RATE_PATTERN.test(value) && /[1-9]/.test(value);
}

/** Percent change from `previous` to `next`. Display only. */
export function percentChange(previous: string, next: string) {
  const from = Number(previous);
  const to = Number(next);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
  return ((to - from) / from) * 100;
}

export function formatPercentChange(change: number | null) {
  if (change == null) return "-";
  if (change === 0) return "0%";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export function relativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function absoluteTime(value: string) {
  return formatDate(value, "dd MMM yyyy, h:mm:ss a");
}

/** Prefer `exact` (precise major units) over the display number. */
export function formatFxMoney(money: FxMoney) {
  const amount = money.exact?.trim()
    ? formatDecimalString(money.exact)
    : money.value.toLocaleString("en", { maximumFractionDigits: 8 });
  return withCurrency(amount, money.currencyCode);
}

/** Preview lines for the set-rate form. Display only: the computed figure is never sent. */
export function ratePreview(base: string, quote: string, rate: string) {
  const forward = `1 ${base} = ${withCurrency(formatDecimalString(rate), quote)}`;
  const numericRate = Number(rate);
  if (!(numericRate > 0)) return { forward, inverse: null };

  // A round amount of quote currency in the rate's order of magnitude, e.g. ₦1,000,000 for ~1,550.
  const exponent = Math.max(0, Math.round(Math.log10(numericRate)));
  const quoteAmount = 1000 * 10 ** exponent;
  const decimals = isCryptoCurrency(base) ? 8 : 2;
  const converted = quoteAmount / numericRate;

  const inverse = `${withCurrency(quoteAmount.toLocaleString("en"), quote)} ≈ ${converted.toLocaleString("en", {
    minimumFractionDigits: Math.min(2, decimals),
    maximumFractionDigits: decimals,
  })} ${base}`;

  return { forward, inverse };
}
