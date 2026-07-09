"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const LOAN_TENURE_OPTIONS = [
  { value: "7-days", label: "7 Days" },
  { value: "14-days", label: "14 Days" },
  { value: "21-days", label: "21 Days" },
  { value: "30-days", label: "30 Days" },
  { value: "3-months", label: "3 months" },
  { value: "6-months", label: "6 months" },
  { value: "12-months", label: "12 months" },
  { value: "24-months", label: "24 months" },
];

const COLLATERAL_CURRENCY_OPTIONS = [
  { value: "usdt", label: "USDT" },
  { value: "btc", label: "BTC" },
  { value: "usdc", label: "USDC" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type LoanEligibilityStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function LoanEligibilityStep({ control }: LoanEligibilityStepProps) {
  return (
    <div className="space-y-5">
      <FormSwitchField
        control={control}
        name="eligibleAsLoanCollateral"
        label="Eligible as loan collateral"
        description="Assets of this class can back financing requests"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="minimumLoanAmount" label="Minimum loan amount (USD)" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="maximumLoanAmount" label="Maximum loan amount (USD)" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormField control={control} name="maximumLtvRatioPercent" label="Maximum LTV ratio">
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField
        control={control}
        name="supportedLoanTenures"
        label="Supported loan tenures (Multi-select)"
      >
        {({ field }) => (
          <ToggleGroup
            selection="multiple"
            look="pill"
            value={field.value}
            onValueChange={field.onChange}
          >
            {LOAN_TENURE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </FormField>

      <FormField
        control={control}
        name="acceptedCollateralCurrencies"
        label="Accepted collateral currencies"
      >
        {({ field }) => (
          <ToggleGroup
            selection="multiple"
            look="pill"
            value={field.value}
            onValueChange={field.onChange}
          >
            {COLLATERAL_CURRENCY_OPTIONS.map((option) => (
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
