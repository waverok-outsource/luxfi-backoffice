"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialogContent, ModalRoot } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormTextarea,
} from "@/components/util/form-controller";
import { cn } from "@/lib/utils";
import {
  absoluteTime,
  describeRate,
  formatPercentChange,
  isValidRate,
  pairLabel,
  percentChange,
  ratePreview,
  relativeTime,
} from "@/module/dashboard/fx-rates/format";
import { setFxRateFormSchema, type SetFxRateFormValues } from "@/schema/fx-rate.schema";
import useFxRateFns from "@/services/functions/fx-rate.fns";
import {
  CRYPTO_CURRENCIES,
  FIAT_CURRENCIES,
  FX_NOTE_MAX_LENGTH,
  FX_RATE_CHANGE_CONFIRM_THRESHOLD,
  isCryptoCurrency,
  type FxCurrency,
  type FxRate,
  type FxRatePurpose,
} from "@/types/fx-rate.type";
import route from "@/util/route";

export type SetFxRatePrefill = {
  base: FxCurrency;
  quote: FxCurrency;
  purpose: FxRatePurpose;
};

const PURPOSE_OPTIONS: { value: FxRatePurpose; label: string; help: string }[] = [
  {
    value: "payout",
    label: "Payout",
    help: "Used when disbursing loans into the customer's wallet.",
  },
  {
    value: "collection",
    label: "Collection",
    help: "Used when customers repay from a wallet in another currency.",
  },
];

type SetFxRateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: SetFxRatePrefill | null;
  currentRates: FxRate[];
};

export function SetFxRateDialog({ open, onOpenChange, prefill, currentRates }: SetFxRateDialogProps) {
  const router = useRouter();
  const { setFxRate, loading } = useFxRateFns();
  const [step, setStep] = useState<"FORM" | "CONFIRM_CHANGE">("FORM");
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<SetFxRateFormValues | null>(null);
  const [showCrypto, setShowCrypto] = useState(
    Boolean(prefill && (isCryptoCurrency(prefill.base) || isCryptoCurrency(prefill.quote))),
  );

  const { control, handleSubmit } = useForm<SetFxRateFormValues>({
    resolver: zodResolver(setFxRateFormSchema),
    defaultValues: {
      base: prefill?.base ?? "USD",
      quote: prefill?.quote ?? "NGN",
      purpose: prefill?.purpose ?? "payout",
      rate: "",
      note: "",
    },
    mode: "onTouched",
  });

  const [base, quote, purpose, rate] = useWatch({ control, name: ["base", "quote", "purpose", "rate"] });
  const current = currentRates.find(
    (item) => item.base === base && item.quote === quote && item.purpose === purpose,
  );
  const trimmedRate = (rate ?? "").trim();
  const rateIsValid = isValidRate(trimmedRate);
  const change = current && rateIsValid ? percentChange(current.rate, trimmedRate) : null;
  const bigChange = change != null && Math.abs(change) > FX_RATE_CHANGE_CONFIRM_THRESHOLD;
  const preview = rateIsValid && base !== quote ? ratePreview(base, quote, trimmedRate) : null;

  const send = async (values: SetFxRateFormValues) => {
    setServerError(null);
    const note = values.note.trim();
    const result = await setFxRate({
      base: values.base,
      quote: values.quote,
      purpose: values.purpose,
      rate: values.rate.trim(),
      ...(note ? { note } : {}),
    });

    if (result.kind === "error") {
      setServerError(result.message);
      setStep("FORM");
      return;
    }

    if (result.kind === "pending") {
      toast.success("Rate submitted for approval", {
        description: `${pairLabel(values.base, values.quote)} ${values.purpose} rate is waiting for another authorised user.`,
        // The approvals screen has no per-approval route; "My requests" lists the new one at the top.
        action: { label: "View request", onClick: () => router.push(`${route.dashboard.approvals}?tab=mine`) },
      });
    } else {
      toast.success(result.message);
    }
    onOpenChange(false);
  };

  const onSubmit = (values: SetFxRateFormValues) => {
    const delta = current ? percentChange(current.rate, values.rate.trim()) : null;
    if (delta != null && Math.abs(delta) > FX_RATE_CHANGE_CONFIRM_THRESHOLD) {
      setPendingValues(values);
      setStep("CONFIRM_CHANGE");
      return;
    }
    void send(values);
  };

  if (step === "CONFIRM_CHANGE" && pendingValues) {
    return (
      <ModalRoot
        open={open}
        onOpenChange={onOpenChange}
        closeOnBackdropClick={false}
        contentClassName="w-[calc(100%-2rem)] max-w-[520px] rounded-[24px] border-none bg-primary-white p-6 sm:p-8"
      >
        <ConfirmDialogContent
          title="Large rate change"
          description={`This rate differs from the current one by ${formatPercentChange(change)}. Continue?`}
          confirmLabel="Yes, submit"
          cancelLabel="Go back"
          pending={loading.SET_RATE}
          onCancel={() => setStep("FORM")}
          onConfirm={() => void send(pendingValues)}
        />
      </ModalRoot>
    );
  }

  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton
      closeOnBackdropClick={false}
      title={prefill ? "Update exchange rate" : "Set exchange rate"}
      description="Creates a new current rate and keeps the old one in history. Another authorised user must approve it."
      contentClassName="max-h-[90vh] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
    >
      <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyField control={control} name="base" label="Base currency" showCrypto={showCrypto} />
          <CurrencyField control={control} name="quote" label="Quote currency" showCrypto={showCrypto} />
        </div>
        <label className="flex w-fit items-center gap-2 text-sm text-text-grey">
          <Checkbox checked={showCrypto} onCheckedChange={(value) => setShowCrypto(Boolean(value))} />
          Include crypto currencies
        </label>

        <FormField control={control} name="purpose" label="Purpose" required>
          {({ field }) => (
            <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
              {PURPOSE_OPTIONS.map((option) => {
                const checked = field.value === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
                      checked
                        ? "border-primary-black bg-primary-grey-undertone/60"
                        : "border-primary-grey-stroke hover:bg-primary-grey-undertone/30",
                    )}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={checked}
                      onChange={() => field.onChange(option.value)}
                      onBlur={field.onBlur}
                      className="mt-1 accent-primary-black"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-text-black">{option.label}</span>
                      <span className="mt-0.5 block text-xs text-text-grey">{option.help}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FormField>

        <FormField
          control={control}
          name="rate"
          label={`Rate (${quote} per 1 ${base})`}
          required
          description="Enter the rate exactly as quoted. It is sent as typed, never rounded."
        >
          {({ field }) => (
            <FormControl>
              <Input
                {...field}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                placeholder="1550.25"
                // Allow pasting "1,550.25"; separators are formatting, not part of the value.
                onChange={(event) => field.onChange(event.target.value.replace(/[,\s]/g, ""))}
              />
            </FormControl>
          )}
        </FormField>

        {preview ? (
          <div className="rounded-2xl bg-primary-grey-undertone/60 px-4 py-3 text-sm">
            <p className="font-semibold text-text-black">{preview.forward}</p>
            {preview.inverse ? <p className="mt-1 text-text-grey">{preview.inverse}</p> : null}
            <p className="mt-1 text-xs text-text-grey">Preview only. The backend does the conversion.</p>
          </div>
        ) : null}

        {current ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              bigChange ? "border-alert-warning bg-alertSoft-warning" : "border-primary-grey-stroke",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-text-grey">
                Current {purpose} rate{" "}
                <span title={absoluteTime(current.createdAt)}>(set {relativeTime(current.createdAt)})</span>
              </p>
              {current.stale ? (
                <Badge variant="error" showStatusDot>
                  Stale
                </Badge>
              ) : null}
            </div>
            <dl className="mt-2 grid gap-1 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-text-grey">Current</dt>
                <dd className="font-semibold text-text-black">{describeRate(base, quote, current.rate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-grey">New</dt>
                <dd className="font-semibold text-text-black">
                  {rateIsValid ? describeRate(base, quote, trimmedRate) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-grey">Change</dt>
                <dd className={cn("font-semibold", bigChange ? "text-text-amber" : "text-text-black")}>
                  {formatPercentChange(change)}
                </dd>
              </div>
            </dl>
            {bigChange ? (
              <p className="mt-2 flex items-center gap-2 text-xs font-medium text-text-amber">
                <AlertTriangle className="size-4 shrink-0" />
                More than {FX_RATE_CHANGE_CONFIRM_THRESHOLD}% from the current rate. You will be asked to confirm.
              </p>
            ) : null}
          </div>
        ) : base !== quote ? (
          <p className="text-xs text-text-grey">
            No {purpose} rate exists for {pairLabel(base, quote)} yet. This will be the first one.
          </p>
        ) : null}

        <FormField
          control={control}
          name="note"
          label="Note"
          description="Where the rate came from, e.g. “Bank quote ref 48213” or “CBN window 27 Nov”."
        >
          {({ field }) => (
            <FormTextarea
              {...field}
              maxLength={FX_NOTE_MAX_LENGTH}
              placeholder="Source or reference"
              className="min-h-16 rounded-2xl"
            />
          )}
        </FormField>

        {serverError ? (
          <div role="alert" className="flex items-start gap-2 rounded-2xl bg-alertSoft-error px-4 py-3 text-sm text-text-red">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="grey-stroke" onClick={() => onOpenChange(false)} disabled={loading.SET_RATE}>
            Cancel
          </Button>
          <Button type="submit" pending={loading.SET_RATE}>
            Submit for approval
          </Button>
        </div>
      </form>
    </ModalRoot>
  );
}

function CurrencyField({
  control,
  name,
  label,
  showCrypto,
}: {
  control: Control<SetFxRateFormValues>;
  name: "base" | "quote";
  label: string;
  showCrypto: boolean;
}) {
  return (
    <FormField control={control} name={name} label={label} required>
      {({ field }) => {
        const choices: readonly string[] = showCrypto
          ? [...FIAT_CURRENCIES, ...CRYPTO_CURRENCIES]
          : isCryptoCurrency(field.value)
            ? [...FIAT_CURRENCIES, field.value]
            : FIAT_CURRENCIES;
        return (
          <Select
            value={field.value}
            onValueChange={(value) => {
              if (typeof value === "string") field.onChange(value);
            }}
          >
            <FormSelectTrigger>
              <SelectValue>{(selected: string | null) => selected ?? "Select currency"}</SelectValue>
            </FormSelectTrigger>
            <SelectContent>
              {choices.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormField>
  );
}
