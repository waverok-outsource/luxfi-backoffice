import type { AssetCategoryStatus, AssetItemListingStatus } from "@/types/asset-management.type";

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

// Used by the Manage Assets table (asset items are still mock/local for now).
export const LISTING_STATUS_CONFIG: Record<
  AssetItemListingStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  listed: { label: "Listed", variant: "success" },
  unlisted: { label: "Unlisted", variant: "neutral" },
};

// Used by the Manage Categories table — real /v1/asset-categories status values.
export const ASSET_CATEGORY_STATUS_CONFIG: Record<
  AssetCategoryStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  published: { label: "Published", variant: "success" },
  unpublished: { label: "Unpublished", variant: "neutral" },
};
