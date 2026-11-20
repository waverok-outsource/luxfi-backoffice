"use client";

import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ModalRoot } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormControl, FormCurrencyInput, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { ReferenceSearch } from "@/module/dashboard/fees/components/reference-search";
import { feeLabel, resolveFeeOptions, toQuoteFeePayload } from "@/module/dashboard/fees/form";
import { quoteFeeFormSchema, type QuoteFeeFormValues } from "@/schema/fee.schema";
import {
  fetchAssetCategories,
  fetchAssetClasses,
  fetchAssets,
} from "@/services/client/asset-management.fns";
import useFeeFns from "@/services/functions/fee.fns";
import { useFeeOptions } from "@/services/queries/fee.queries";
import type { FeeQuote } from "@/types/fee.type";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import keyFactory from "@/util/query-key-factory";

const EMPTY_QUOTE: QuoteFeeFormValues = {
  trigger: "",
  amount: "",
  currencyCode: "",
  assetClassId: "",
  assetClassLabel: "",
  assetCategoryId: "",
  assetCategoryLabel: "",
  assetId: "",
  assetLabel: "",
};

type QuoteFeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuoteFeeDialog({ open, onOpenChange }: QuoteFeeDialogProps) {
  const { quoteFee, loading } = useFeeFns();
  const { data: optionsResponse } = useFeeOptions();
  const options = resolveFeeOptions(optionsResponse?.data);
  const [result, setResult] = useState<FeeQuote | null>(null);
  const { control, handleSubmit, setValue } = useForm<QuoteFeeFormValues>({
    resolver: zodResolver(quoteFeeFormSchema) as unknown as Resolver<QuoteFeeFormValues>,
    defaultValues: EMPTY_QUOTE,
  });
  const currencyCode = useWatch({ control, name: "currencyCode" });

  const onSubmit = async (values: QuoteFeeFormValues) => {
    const quote = await quoteFee(toQuoteFeePayload(values));
    setResult(quote);
  };

  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton
      title="Quote a transaction"
      description="Shows which active fees would be charged. Nothing is saved."
      contentClassName="max-h-[90vh] w-[calc(100%-2rem)] max-w-[760px] overflow-y-auto rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
    >
      <form
        className="mt-4 space-y-4"
        onSubmit={handleSubmit(onSubmit, () => toast.error("Check the highlighted fields and try again."))}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FormField control={control} name="trigger" label="Trigger" required>
            {({ field }) => (
              <Select
                value={field.value || null}
                onValueChange={(value) => {
                  if (typeof value === "string") field.onChange(value);
                }}
              >
                <FormSelectTrigger>
                  <SelectValue>
                    {(selected: string | null) => (selected ? feeLabel(selected) : "Select a trigger")}
                  </SelectValue>
                </FormSelectTrigger>
                <SelectContent>
                  {options.triggers.map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>
                      {feeLabel(trigger)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField control={control} name="amount" label="Amount" required>
            {({ field }) => (
              <FormCurrencyInput
                name={field.name}
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? "")}
                onBlur={field.onBlur}
                placeholder="0.00"
              />
            )}
          </FormField>
          <FormField control={control} name="currencyCode" label="Currency">
            {({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  maxLength={3}
                  placeholder="NGN"
                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                />
              </FormControl>
            )}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <QuoteLookup
            control={control}
            idName="assetClassId"
            labelName="assetClassLabel"
            label="Asset class"
            placeholder="Optional"
            setValue={setValue}
            kind="asset_class"
          />
          <QuoteLookup
            control={control}
            idName="assetCategoryId"
            labelName="assetCategoryLabel"
            label="Asset category"
            placeholder="Optional"
            setValue={setValue}
            kind="asset_category"
          />
          <QuoteLookup
            control={control}
            idName="assetId"
            labelName="assetLabel"
            label="Asset"
            placeholder="Optional"
            setValue={setValue}
            kind="asset"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" pending={loading.QUOTE}>
            Calculate
          </Button>
        </div>
      </form>

      {result ? <QuoteResult quote={result} currencyCode={currencyCode} /> : null}
    </ModalRoot>
  );
}

function QuoteResult({ quote, currencyCode }: { quote: FeeQuote; currencyCode: string }) {
  const currency = currencyCode.trim().toUpperCase() || undefined;
  return (
    <div className="mt-6 space-y-4 border-t border-primary-grey-stroke pt-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultStat label="Payer pays" value={formatCurrency(quote.payerPays, currency)} />
        <ResultStat label="Payee receives" value={formatCurrency(quote.payeeReceives, currency)} />
        <ResultStat label="Payer fees" value={formatCurrency(quote.payerTotal, currency)} />
        <ResultStat label="Payee fees" value={formatCurrency(quote.payeeTotal, currency)} />
      </div>
      {quote.fees.length ? (
        <ul className="space-y-2">
          {quote.fees.map((fee) => (
            <li
              key={`${fee.feeId}-${fee.bearer}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-primary-grey-undertone/50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-text-black">{fee.name}</p>
                <p className="text-xs text-text-grey">
                  {feeLabel(fee.feeType)} · {feeLabel(fee.bearer)} · {feeLabel(fee.scopeLevel)}
                </p>
              </div>
              <p className="text-sm font-semibold text-text-black">{formatCurrency(fee.amount, currency)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-grey">No active fee applies to this transaction.</p>
      )}
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-primary-grey-undertone/60 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-black">{value}</p>
    </div>
  );
}

function QuoteLookup({
  control,
  idName,
  labelName,
  label,
  placeholder,
  setValue,
  kind,
}: {
  control: ReturnType<typeof useForm<QuoteFeeFormValues>>["control"];
  idName: "assetClassId" | "assetCategoryId" | "assetId";
  labelName: "assetClassLabel" | "assetCategoryLabel" | "assetLabel";
  label: string;
  placeholder: string;
  setValue: ReturnType<typeof useForm<QuoteFeeFormValues>>["setValue"];
  kind: "asset_class" | "asset_category" | "asset";
}) {
  const selectedId = useWatch({ control, name: idName });
  const selectedLabel = useWatch({ control, name: labelName });
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 400);
  const search = convertObjectToQuery({ q: debounced, page: "1", limit: "8" });
  const enabled = debounced.length > 0;

  const classes = useQuery({
    queryKey: keyFactory.assetManagement.classes.list(`quote-${search}`),
    queryFn: () => fetchAssetClasses(search),
    enabled: enabled && kind === "asset_class",
  });
  const categories = useQuery({
    queryKey: keyFactory.assetManagement.categories.list(`quote-${search}`),
    queryFn: () => fetchAssetCategories(search),
    enabled: enabled && kind === "asset_category",
  });
  const assets = useQuery({
    queryKey: keyFactory.assetManagement.assets.list(`quote-${search}`),
    queryFn: () => fetchAssets(search),
    enabled: enabled && kind === "asset",
  });

  const options =
    kind === "asset_class"
      ? (classes.data?.data ?? []).map((item) => ({ id: item.assetClassId, label: item.name, hint: item.assetClassId }))
      : kind === "asset_category"
        ? (categories.data?.data ?? []).flatMap((item) => {
            const id = item.categoryRef || item.reference;
            return id ? [{ id, label: item.name, hint: id }] : [];
          })
        : (assets.data?.data ?? []).map((item) => ({ id: item.assetId, label: item.name, hint: item.assetId }));

  return (
    <FormField control={control} name={idName} label={label}>
      {() => (
        <ReferenceSearch
          query={query}
          onQueryChange={setQuery}
          placeholder={placeholder}
          options={options}
          isLoading={classes.isFetching || categories.isFetching || assets.isFetching}
          selected={selectedId ? [{ id: selectedId, label: selectedLabel || selectedId }] : []}
          onSelect={(option) => {
            setValue(idName, option.id, { shouldDirty: true });
            setValue(labelName, option.label, { shouldDirty: true });
            setQuery("");
          }}
          onRemove={() => {
            setValue(idName, "");
            setValue(labelName, "");
          }}
        />
      )}
    </FormField>
  );
}
