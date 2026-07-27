"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import { CURRENCY_VALUES, type AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const CURRENCY_OPTIONS = CURRENCY_VALUES.map((value) => ({ value, label: value }));

const INVESTOR_PROFILE_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "high_networth_individuals", label: "High Networth Individuals" },
  { value: "institutional", label: "Institutional" },
  { value: "accredited_investors", label: "Accredited Investors" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type InvestorEligibilityStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function InvestorEligibilityStep({ control }: InvestorEligibilityStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="investorEligibility.investmentAmount.min"
          label="Minimum investment (USD)"
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
          name="investorEligibility.investmentAmount.max"
          label="Maximum single-investor exposure (USD)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormField
        control={control}
        name="investorEligibility.investmentAmount.currency"
        label="Investment currency"
        required
      >
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

      <FormField
        control={control}
        name="investorEligibility.investorProfilesAllowed"
        label="Eligible investor profiles"
      >
        {({ field }) => (
          <ToggleGroup
            selection="multiple"
            look="pill"
            value={field.value}
            onValueChange={field.onChange}
          >
            {INVESTOR_PROFILE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </FormField>

      <FormSwitchField
        control={control}
        name="investorEligibility.requiresAccreditation"
        label="Accreditation verification required"
        description="Investor must hold verified accredited status before access"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="investorEligibility.checkSuitability"
        label="Suitability assessment required"
        description="Require completion of risk suitability questionnaire"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="investorEligibility.requiresAdvisorApproval"
        label="Advisor sign-off required"
        description="Participation must be approved by relationship manager"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="investorEligibility.lockOnCommit"
        label="Lock investor once committed"
        description="Prevent withdrawal until minimum holding period elapses"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />
    </div>
  );
}
