"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const INVESTOR_PROFILE_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "high-net-worth", label: "High Net Worth (HNI)" },
  { value: "institutional", label: "Institutional" },
  { value: "accredited-sec-reg-d", label: "Accredited (SEC Reg D)" },
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
        <FormField control={control} name="minimumInvestment" label="Minimum investment (USD)" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="0.00" startAdornment="$" />
            </FormControl>
          )}
        </FormField>

        <FormField
          control={control}
          name="maximumSingleInvestorExposure"
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

      <FormField control={control} name="eligibleInvestorProfiles" label="Eligible investor profiles">
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
        name="accreditationVerificationRequired"
        label="Accreditation verification required"
        description="Investor must hold verified accredited status before access"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="suitabilityAssessmentRequired"
        label="Suitability assessment required"
        description="Require completion of risk suitability questionnaire"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="advisorSignOffRequired"
        label="Advisor sign-off required"
        description="Participation must be approved by relationship manager"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="lockInvestorOnceCommitted"
        label="Lock investor once committed"
        description="Prevent withdrawal until minimum holding period elapses"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />
    </div>
  );
}
