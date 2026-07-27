"use client";

import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormControl, FormField, FormSwitchField } from "@/components/util/form-controller";
import { DurationField } from "@/module/dashboard/asset-management/components/duration-field";
import type { AssetClassConfigFormValues } from "@/schema/asset-management.schema";

const VISIBILITY_PATTERN_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "buyers_only", label: "Buyers Only" },
  { value: "sellers_only", label: "Sellers Only" },
];

const COMMISSION_TYPE_OPTIONS = [
  { value: "percentage", label: "Percentage" },
  { value: "flat", label: "Flat" },
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
        name="marketPlace.canList"
        label="List on marketplace"
        description="Make discoverable to eligible buyers on the platform"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <FormSwitchField
        control={control}
        name="marketPlace.canFeature"
        label="Featured placement eligible"
        description="Eligible for curated or promoted listing slots"
        size="sm"
        className={SWITCH_ROW_CLASSNAME}
        contentClassName={SWITCH_ROW_CONTENT_CLASSNAME}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="marketPlace.commission.value"
          label="Commission rate (%)"
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter here" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="marketPlace.listingExpiry" label="Listing expiry" required>
          {({ field }) => <DurationField value={field.value} onChange={field.onChange} />}
        </FormField>
      </div>

      <FormField control={control} name="marketPlace.commission.type" label="Commission type">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {COMMISSION_TYPE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </FormField>

      <FormField control={control} name="marketPlace.priceVisibilityPattern" label="Price visibility">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {VISIBILITY_PATTERN_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </FormField>

      <FormField control={control} name="marketPlace.offerPattern" label="Offer pattern">
        {({ field }) => (
          <ToggleGroup selection="single" look="segmented" value={field.value} onValueChange={field.onChange}>
            {VISIBILITY_PATTERN_OPTIONS.map((option) => (
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
