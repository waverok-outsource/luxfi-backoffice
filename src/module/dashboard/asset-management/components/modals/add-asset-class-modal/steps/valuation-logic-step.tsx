"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const VALUATION_METHOD_OPTIONS = [
  { value: "market_price", label: "Market Price" },
  { value: "appraisal_based", label: "Appraisal Based" },
  { value: "cost_based", label: "Cost Based" },
  { value: "comparable_sales", label: "Comparable Sales" },
];

const VALUATION_PROVIDER_OPTIONS = [
  { value: "watchcharts", label: "WatchCharts" },
  { value: "chrono24", label: "Chrono24" },
  { value: "internal_appraisal_team", label: "Internal Appraisal Team" },
  { value: "third_party_appraiser", label: "Third-Party Appraiser" },
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
        <FormField control={control} name="valuationLogic.method" label="Valuation method" required>
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
          name="valuationLogic.valuationProvider"
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
        name="valuationLogic.requiresSecondOpinion"
        label="Require second-opinion valuation"
        description="Dual-appraisal workflow for assets above threshold"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="valuationLogic.valuationDriftAlertsEnabled"
        label="Alert on valuation drift"
        description="Notify underwriting when revaluation moves sharply"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormField
        control={control}
        name="valuationLogic.driftRate"
        label="Drift alert threshold (%)"
        required
      >
        {({ field }) => (
          <FormControl>
            <Input {...field} placeholder="Enter here" />
          </FormControl>
        )}
      </FormField>

      <FormSwitchField
        control={control}
        name="valuationLogic.canOverridePriceManually"
        label="Override price feed manually"
        description="Admins can set a fixed override price per item"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />
    </div>
  );
}
