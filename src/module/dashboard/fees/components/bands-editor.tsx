"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch, type Control, type UseFormGetValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormControl, FormCurrencyInput, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { blankBand, feeLabel } from "@/module/dashboard/fees/form";
import type { FeeFormValues } from "@/schema/fee.schema";
import { FEE_BAND_METHODS } from "@/types/fee.type";

type BandsEditorProps = {
  control: Control<FeeFormValues>;
  getValues: UseFormGetValues<FeeFormValues>;
  error?: string;
  currencyCode?: string;
};

export function BandsEditor({ control, getValues, error, currencyCode }: BandsEditorProps) {
  const bands = useFieldArray({ control, name: "bands" });
  const rows = useWatch({ control, name: "bands" });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-sm text-text-grey">
          Bands must meet without gaps. The minimum is included and the maximum is excluded. Only the
          highest band can leave the maximum empty.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const current = getValues("bands");
            const previous = current[current.length - 1];
            bands.append({ ...blankBand(), min: previous?.max ?? "" });
          }}
        >
          <Plus className="h-4 w-4" />
          Add band
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="space-y-3">
        {bands.fields.map((band, index) => {
          const method = rows?.[index]?.method ?? "percentage";
          return (
            <article
              key={band.id}
              className="grid gap-3 rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone/40 p-4 md:grid-cols-[1fr_1fr_180px_1fr_auto]"
            >
              <FormField control={control} name={`bands.${index}.min`} label="From" required>
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
              <FormField control={control} name={`bands.${index}.max`} label="Up to">
                {({ field }) => (
                  <FormCurrencyInput
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    onBlur={field.onBlur}
                    placeholder="And above"
                  />
                )}
              </FormField>
              <FormField control={control} name={`bands.${index}.method`} label="Method" required>
                {({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (typeof value === "string") field.onChange(value);
                    }}
                  >
                    <FormSelectTrigger>
                      <SelectValue>
                        {(selected: string | null) => (selected ? feeLabel(selected) : "Method")}
                      </SelectValue>
                    </FormSelectTrigger>
                    <SelectContent>
                      {FEE_BAND_METHODS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {feeLabel(item)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <FormField control={control} name={`bands.${index}.value`} label="Value" required>
                {({ field }) =>
                  method === "percentage" ? (
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="2.5"
                        endAdornment={<span className="text-sm font-semibold">%</span>}
                      />
                    </FormControl>
                  ) : (
                    <FormCurrencyInput
                      name={field.name}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      onBlur={field.onBlur}
                      placeholder="0.00"
                      endAdornment={
                        currencyCode ? <span className="text-xs font-semibold">{currencyCode}</span> : undefined
                      }
                    />
                  )
                }
              </FormField>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove band ${index + 1}`}
                  disabled={bands.fields.length === 1}
                  onClick={() => bands.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
