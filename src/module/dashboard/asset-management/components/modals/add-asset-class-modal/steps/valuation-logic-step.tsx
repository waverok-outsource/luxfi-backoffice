"use client";

import type { Control } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const VALUATION_METHOD_OPTIONS = [
  { value: "market-price", label: "Market Price" },
  { value: "appraisal-based", label: "Appraisal-Based" },
  { value: "cost-based", label: "Cost-Based" },
  { value: "comparable-sales", label: "Comparable Sales" },
];

const VALUATION_PROVIDER_OPTIONS = [
  { value: "watchcharts", label: "WatchCharts" },
  { value: "chrono24", label: "Chrono24" },
  { value: "internal-appraisal-team", label: "Internal Appraisal Team" },
  { value: "third-party-appraiser", label: "Third-Party Appraiser" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type ValuationLogicStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function ValuationLogicStep({ control }: ValuationLogicStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="valuationMethod" label="Valuation method" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      VALUATION_METHOD_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {VALUATION_METHOD_OPTIONS.map((option) => (
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
          name="approvedValuationProvider"
          label="Approved valuation provider"
          required
        >
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      VALUATION_PROVIDER_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {VALUATION_PROVIDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormSwitchField
        control={control}
        name="overridePriceFeedManually"
        label="Override price feed manually"
        description="Admins can set a fixed override price per item"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="requireSecondOpinionValuation"
        label="Require second-opinion valuation"
        description="Dual-appraisal workflow for assets above threshold"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="alertOnValuationDrift"
        label="Alert on valuation drift (>15%)"
        description="Notify underwriting when revaluation moves sharply"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />
    </div>
  );
}
