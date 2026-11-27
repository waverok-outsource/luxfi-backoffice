"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  absoluteTime,
  describeRate,
  formatFxMoney,
  purposeLabel,
  relativeTime,
} from "@/module/dashboard/fx-rates/format";
import useFxRateFns from "@/services/functions/fx-rate.fns";
import { FX_CURRENCIES, FX_RATE_PURPOSES, type FxQuote, type FxRatePurpose } from "@/types/fx-rate.type";

const AMOUNT_PATTERN = /^\d{1,15}(\.\d{1,10})?$/;

export function FxConverterPanel() {
  const { quoteFx, loading } = useFxRateFns();
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("NGN");
  const [amount, setAmount] = useState("100");
  const [purpose, setPurpose] = useState<FxRatePurpose>("payout");
  const [result, setResult] = useState<FxQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trimmedAmount = amount.trim();
  const amountValid = AMOUNT_PATTERN.test(trimmedAmount) && /[1-9]/.test(trimmedAmount);

  const convert = async () => {
    if (!amountValid) {
      setError("Enter an amount greater than zero, e.g. 100 or 2500.50.");
      setResult(null);
      return;
    }
    setError(null);
    const response = await quoteFx({ from, to, amount: trimmedAmount, purpose });
    if (response.kind === "error") {
      setResult(null);
      setError(response.message);
      return;
    }
    setResult(response.quote);
  };

  return (
    <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
      <div>
        <h3 className="text-base font-semibold text-text-black">Converter</h3>
        <p className="mt-1 text-sm text-text-grey">
          Check what an amount converts to at the current rate. Nothing is saved.
        </p>
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void convert();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="fx-convert-amount">Amount</Label>
          <Input
            id="fx-convert-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/[,\s]/g, ""))}
            placeholder="100"
          />
        </div>
        <CurrencySelect id="fx-convert-from" label="From" value={from} onChange={setFrom} />
        <CurrencySelect id="fx-convert-to" label="To" value={to} onChange={setTo} />
        <div className="space-y-2">
          <Label>Purpose</Label>
          <Select
            value={purpose}
            onValueChange={(value) => {
              if (value === "payout" || value === "collection") setPurpose(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{(selected: string | null) => purposeLabel(selected ?? "payout")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FX_RATE_PURPOSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {purposeLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" pending={loading.QUOTE} disabled={from === to}>
          Convert
        </Button>
      </form>

      {from === to ? <p className="text-xs text-text-grey">Choose two different currencies.</p> : null}

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-2xl bg-alertSoft-error px-4 py-3 text-sm text-text-red">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {result ? (
        <div className="space-y-2 rounded-2xl bg-primary-grey-undertone/60 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-text-black">
              {formatFxMoney(result.source)} = {formatFxMoney(result.target)}
            </p>
            {result.stale ? (
              <Badge variant="error" showStatusDot>
                Stale rate
              </Badge>
            ) : null}
          </div>
          {result.converted ? (
            <p className="text-sm text-text-grey">
              {purposeLabel(result.purpose)} rate {describeRate(result.source.currencyCode, result.target.currencyCode, result.rate)}
              , set{" "}
              <span title={absoluteTime(result.rateSetAt)}>{relativeTime(result.rateSetAt)}</span>.{" "}
              {result.purpose === "payout" ? "Payout amounts round down." : "Collection amounts round up."}
            </p>
          ) : (
            <p className="text-sm text-text-grey">Same currency, no conversion applied.</p>
          )}
          {result.stale ? (
            <p className="text-xs font-medium text-text-red">
              {result.purpose === "payout"
                ? "This rate is stale, so loan disbursements using it are blocked until a new rate is approved."
                : "This rate is stale, so customer repayments using it are blocked until a new rate is approved."}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function CurrencySelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (typeof next === "string") onChange(next);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{(selected: string | null) => selected ?? "Select"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {FX_CURRENCIES.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
