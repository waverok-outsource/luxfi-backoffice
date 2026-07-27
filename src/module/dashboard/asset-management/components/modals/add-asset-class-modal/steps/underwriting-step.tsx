"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import { DurationField } from "@/module/dashboard/asset-management/components/duration-field";
import { CURRENCY_VALUES, type AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const CURRENCY_OPTIONS = CURRENCY_VALUES.map((value) => ({ value, label: value }));

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type UnderwritingStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function UnderwritingStep({ control }: UnderwritingStepProps) {
  return (
    <div className="space-y-5">
      <FormSwitchField
        control={control}
        name="underwritingControls.canManuallyUnderwrite"
        label="Manual underwriting required"
        description="All applications require a human underwriter"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="underwritingControls.usesAutomatedCreditScoring"
        label="Enable automated credit scoring"
        description="Pull bureau score and flag borderline applicants"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="underwritingControls.requiresApproval"
        label="Requires approval"
        description="An approver must countersign before the loan is issued"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="underwritingControls.underwritingSla"
          label="Underwriting SLA"
          required
        >
          {({ field }) => <DurationField value={field.value} onChange={field.onChange} />}
        </FormField>

        <FormField
          control={control}
          name="underwritingControls.kycTierRequired"
          label="KYC tier required (ID)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter KYC tier ID" />
            </FormControl>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="underwritingControls.autoApprovalAmount"
          label="Auto-approval threshold (USD)"
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
          name="underwritingControls.autoApprovalCurrency"
          label="Auto-approval currency"
          required
        >
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      CURRENCY_OPTIONS.find((option) => option.value === selected)?.label ?? selected
                    );
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
      </div>

      <FormField
        control={control}
        name="underwritingControls.minCreditScore"
        label="Minimum credit score"
        required
      >
        {({ field }) => (
          <FormControl>
            <Input {...field} placeholder="Enter here" />
          </FormControl>
        )}
      </FormField>
    </div>
  );
}
