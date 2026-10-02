import type { AssetBrandStatus } from "@/types/asset-management.type";

export type AssetCategoryDetailsTabValue = "manage-brands";

type TabConfig = {
  value: AssetCategoryDetailsTabValue;
  label: string;
};

export const assetCategoryDetailsTabs: TabConfig[] = [
  { value: "manage-brands", label: "Manage Brands" },
];

export const DEFAULT_ASSET_CATEGORY_DETAILS_TAB: AssetCategoryDetailsTabValue = "manage-brands";

export const ASSET_BRAND_STATUS_CONFIG: Record<
  AssetBrandStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "neutral" },
  unpublished: { label: "Unpublished", variant: "neutral" },
};

export function normalizeAssetBrandStatus(status: string | undefined): AssetBrandStatus {
  const normalized = status?.toLowerCase();

  if (normalized === "published" || normalized === "draft" || normalized === "unpublished") {
    return normalized;
  }

  return "draft";
}
