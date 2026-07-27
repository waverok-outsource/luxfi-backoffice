"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { DurationListField } from "@/module/dashboard/asset-management/components/duration-field";
import { CURRENCY_VALUES, type AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const CURRENCY_OPTIONS = CURRENCY_VALUES.map((value) => ({ value, label: value }));

type LoanEligibilityStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function LoanEligibilityStep({ control }: LoanEligibilityStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="loanEligibility.minLoanAmount"
          label="Minimum loan amount (USD)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>

        <FormField
          control={control}
          name="loanEligibility.maxLoanAmount"
          label="Maximum loan amount (USD)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormField control={control} name="loanEligibility.loanCurrency" label="Loan currency" required>
        {({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <FormSelectTrigger>
              <SelectValue placeholder="Select Options">
                {(selected: string | null) => {
                  if (!selected) return "Select Options";
                  return CURRENCY_OPTIONS.find((option) => option.value === selected)?.label ?? selected;
                }}
              </SelectValue>
            </FormSelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      <FormField control={control} name="loanEligibility.maxLtv" label="Maximum LTV ratio">
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField control={control} name="loanEligibility.loanTenure" label="Loan tenures">
        {({ field }) => (
          <DurationListField value={field.value} onChange={field.onChange} addLabel="Add tenure" />
        )}
      </FormField>

      <FormField
        control={control}
        name="loanEligibility.acceptedCollateralCurrencies"
        label="Accepted collateral currencies"
      >
        {({ field }) => (
          <ToggleGroup
            selection="multiple"
            look="pill"
            value={field.value}
            onValueChange={field.onChange}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </FormField>
    </div>
  );
}
