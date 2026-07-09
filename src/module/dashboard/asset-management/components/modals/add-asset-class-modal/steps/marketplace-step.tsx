"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const PRICE_VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "buyers-only", label: "Buyers only" },
  { value: "sellers-only", label: "Sellers only" },
];

const SWITCH_ROW_CLASSNAME = "border-b border-primary-grey-stroke pb-4 last:border-b-0 last:pb-0";
const SWITCH_ROW_CONTENT_CLASSNAME = "w-full flex-row-reverse justify-between";

type MarketplaceStepProps = {
  control: Control<AssetClassConfigFormValues>;
};

export function MarketplaceStep({ control }: MarketplaceStepProps) {
  return (
    <div className="space-y-5">
      <FormSwitchField
        control={control}
        name="listOnMarketplace"
        label="List on marketplace"
        description="Make discoverable to eligible buyers on the platform"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="featuredPlacementEligible"
        label="Featured placement eligible"
        description="Eligible for curated or promoted listing slots"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="commissionRatePercent" label="Commission rate (%)" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="listingExpiryDays" label="Listing expiry (days)" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormField control={control} name="priceVisibility" label="Price visibility">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {PRICE_VISIBILITY_OPTIONS.map((option) => (
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
