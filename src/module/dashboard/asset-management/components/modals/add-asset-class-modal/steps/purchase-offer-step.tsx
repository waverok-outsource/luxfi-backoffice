"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import { DurationField } from "@/module/dashboard/asset-management/components/duration-field";
import { OFFER_PATTERN_VALUES, type AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const OFFER_PATTERN_OPTIONS = [
  { value: "fixed_price", label: "Fixed Price" },
  { value: "sealed_auction", label: "Sealed Auction" },
  { value: "negotiated", label: "Negotiated" },
  { value: "best_offer", label: "Best Offer" },
  { value: "hybrid", label: "Hybrid" },
] satisfies { value: (typeof OFFER_PATTERN_VALUES)[number]; label: string }[];

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
          name="purchaseOfferLogic.minOfferAmount"
          label="Minimum offer amount (USD)"
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
          name="purchaseOfferLogic.offerValidity"
          label="Offer validity window"
          required
        >
          {({ field }) => <DurationField value={field.value} onChange={field.onChange} />}
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="purchaseOfferLogic.maxCounterOffers"
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
          name="purchaseOfferLogic.escrowHoldHours"
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
        name="purchaseOfferLogic.allowsCounterOffer"
        label="Enable counteroffer flow"
        description="Sellers may respond with a revised price proposal"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="purchaseOfferLogic.canOfferTriggerEscrow"
        label="Binding offer triggers escrow"
        description="Accepted offers immediately initiate escrow hold"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="purchaseOfferLogic.requiresApproval"
        label="Admin approval required for acceptance"
        description="No offer is finalised without back-office sign-off"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormField
        control={control}
        name="purchaseOfferLogic.autoAcceptancePercentage"
        label="Auto-accept threshold (% of asking price)"
        description="Offers at or above this level auto-accept without admin review"
      >
        {({ field }) => <Slider value={field.value} onValueChange={field.onChange} />}
      </FormField>

      <FormField control={control} name="purchaseOfferLogic.offerPattern" label="Default offer mechanism">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {OFFER_PATTERN_OPTIONS.map((option) => (
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
