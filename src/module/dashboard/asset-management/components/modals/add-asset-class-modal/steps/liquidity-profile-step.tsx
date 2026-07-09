"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
} from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const LIQUIDITY_LEVEL_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const REDEMPTION_WINDOW_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "24-hours", label: "24 Hours" },
  { value: "3-business-days", label: "3 Business Days" },
  { value: "7-business-days", label: "7 Business Days" },
];

const LIQUIDITY_MATURITY_PERIOD_OPTIONS = ["1", "3", "6", "12", "24"];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type LiquidityProfileStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function LiquidityProfileStep({ control }: LiquidityProfileStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="liquidityLevel" label="Liquidity Level" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      LIQUIDITY_LEVEL_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {LIQUIDITY_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <FormField control={control} name="redemptionWindow" label="Redemption window" required>
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select Options">
                  {(selected: string | null) => {
                    if (!selected) return "Select Options";
                    return (
                      REDEMPTION_WINDOW_OPTIONS.find((option) => option.value === selected)?.label ??
                      selected
                    );
                  }}
                </SelectValue>
              </FormSelectTrigger>
              <SelectContent>
                {REDEMPTION_WINDOW_OPTIONS.map((option) => (
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
          name="expectedSettlementDays"
          label="Expected settlement (days)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>

        <FormField
          control={control}
          name="liquidityMaturityPeriodDays"
          label="Liquidity Maturity Period (days)"
          required
        >
          {({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FormSelectTrigger>
                <SelectValue placeholder="Select" />
              </FormSelectTrigger>
              <SelectContent>
                {LIQUIDITY_MATURITY_PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormField
        control={control}
        name="maxIlliquidityCapPercent"
        label="Max illiquidity cap per portfolio"
        description="Maximum % of client portfolio this asset class may represent"
      >
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormSwitchField
        control={control}
        name="secondaryMarketTradeable"
        label="Secondary market tradeable"
        description="Allow peer-to-peer position transfers between clients"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="gateRedemptionsUnderStress"
        label="Gate redemptions under stress"
        description="Suspend redemptions if market conditions breach thresholds"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />
    </div>
  );
}
