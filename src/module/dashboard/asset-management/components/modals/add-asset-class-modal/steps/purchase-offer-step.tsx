"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const DEFAULT_OFFER_MECHANISM_OPTIONS = [
  { value: "fixed-price", label: "Fixed price" },
  { value: "sealed-auction", label: "Sealed auction" },
  { value: "negotiated", label: "Negotiated" },
  { value: "best-offer", label: "Best offer" },
  { value: "hybrid", label: "Hybrid" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type PurchaseOfferStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function PurchaseOfferStep({ control }: PurchaseOfferStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="minimumOfferThreshold"
          label="Minimum offer threshold (USD)"
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
          name="offerValidityWindowDays"
          label="Offer validity window (days)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="maxCounteroffersAllowed"
          label="Max counteroffers allowed"
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
          name="offerEscrowHoldHours"
          label="Offer escrow hold (hours)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormSwitchField
        control={control}
        name="enableCounterofferFlow"
        label="Enable counteroffer flow"
        description="Sellers may respond with a revised price proposal"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="bindingOfferTriggersEscrow"
        label="Binding offer triggers escrow"
        description="Accepted offers immediately initiate escrow hold"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="adminApprovalRequiredForAcceptance"
        label="Admin approval required for acceptance"
        description="No offer is finalised without back-office sign-off"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormField
        control={control}
        name="autoAcceptThresholdPercent"
        label="Auto-accept threshold (% of asking price)"
        description="Offers at or above this level auto-accept without admin review"
      >
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField control={control} name="defaultOfferMechanism" label="Default offer mechanism">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {DEFAULT_OFFER_MECHANISM_OPTIONS.map((option) => (
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
