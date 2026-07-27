"use client";

import type { Control } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const RISK_CATEGORY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STRESS_TEST_MODEL_OPTIONS = [
  { value: "historical_simulation", label: "Historical Simulation" },
  { value: "monte_carlo", label: "Monte Carlo" },
  { value: "parametric_var", label: "Parametric VaR" },
];

const CORRELATED_CLASS_OPTIONS = [
  { value: "watches", label: "Watches" },
  { value: "bags", label: "Bags" },
  { value: "jewelry", label: "Jewelry" },
  { value: "collectibles", label: "Collectibles" },
  { value: "vehicles", label: "Vehicles" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type RiskParametersStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function RiskParametersStep({ control }: RiskParametersStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="riskSettings.riskCategory" label="Risk category" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      RISK_CATEGORY_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {RISK_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <FormField control={control} name="riskSettings.stressTestModel" label="Stress test model" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      STRESS_TEST_MODEL_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {STRESS_TEST_MODEL_OPTIONS.map((option) => (
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
        name="riskSettings.maxAllowedPortfolioPerClient"
        label="Max portfolio concentration per client"
      >
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField
        control={control}
        name="riskSettings.riskAdjustmentFactor"
        label="Correlated risk adjustment factor"
        description="Multiplier when this asset co-moves with another in the portfolio"
      >
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField control={control} name="riskSettings.valueAtRiskThreshold" label="VaR threshold">
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormSwitchField
        control={control}
        name="riskSettings.requiresWriteOff"
        label="Require write-off"
        description="Write off exposure automatically when risk threshold is breached"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="riskSettings.allowsAutoMarginCall"
        label="Auto margin call on LTV breach"
        description="Trigger margin call workflow when LTV exceeds maximum"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="riskSettings.restrictTradingDuringStress"
        label="Restrict new originations under stress"
        description="Pause new lending if portfolio VaR exceeds threshold"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormField control={control} name="riskSettings.correlatedClasses" label="Correlated asset class(es)">
        {({ field }) => (
          <ToggleGroup
            selection="multiple"
            look="pill"
            value={field.value}
            onValueChange={field.onChange}
          >
            {CORRELATED_CLASS_OPTIONS.map((option) => (
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
