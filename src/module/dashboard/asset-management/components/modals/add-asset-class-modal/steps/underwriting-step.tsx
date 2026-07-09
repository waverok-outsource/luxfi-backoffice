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
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const KYC_LEVEL_OPTIONS = [
  { value: "level-1-standard", label: "Level 1 — Standard" },
  { value: "level-2-enhanced-dd", label: "Level 2 — Enhanced DD" },
  { value: "level-3-full-diligence", label: "Level 3 — Full Diligence" },
];

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
        name="manualUnderwritingRequired"
        label="Manual underwriting required"
        description="All applications require a human underwriter"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="enableAutomatedCreditScoring"
        label="Enable automated credit scoring"
        description="Pull bureau score and flag borderline applicants"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="relationshipManagerApprovalRequired"
        label="Relationship manager approval required"
        description="RM must countersign before loan is issued"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="underwritingSlaHours"
          label="Underwriting SLA (business hours)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="kycLevelRequired" label="KYC level required" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      KYC_LEVEL_OPTIONS.find((option) => option.value === selected)?.label ?? selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {KYC_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="autoApprovalThreshold"
          label="Auto-approval threshold (USD)"
          description="Leave blank for always manual"
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Leave blank for always manual" startAdornment="$" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="minimumCreditScore" label="Minimum credit score" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>
      </div>
    </div>
  );
}
