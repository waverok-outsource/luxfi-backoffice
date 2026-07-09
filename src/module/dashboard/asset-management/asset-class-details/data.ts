import type { AssetItemListingStatus } from "@/types/asset-management.type";

export type AssetClassDetailsTabValue = "manage-assets" | "manage-categories";

type TabConfig = {
  value: AssetClassDetailsTabValue;
  label: string;
};

export const assetClassDetailsTabs: TabConfig[] = [
  { value: "manage-assets", label: "Manage Assets" },
  { value: "manage-categories", label: "Manage Categories" },
];

export const DEFAULT_ASSET_CLASS_DETAILS_TAB: AssetClassDetailsTabValue = "manage-assets";

// Shared by the Manage Assets and Manage Categories tables — both use the same listed/unlisted concept.
export const LISTING_STATUS_CONFIG: Record<
  AssetItemListingStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  listed: { label: "Listed", variant: "success" },
  unlisted: { label: "Unlisted", variant: "neutral" },
};
