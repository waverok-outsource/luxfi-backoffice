"use client";

import type { ReactElement } from "react";

import { AddNewBrandAction } from "@/module/dashboard/asset-management/asset-category-details/components/tab-actions/add-new-brand-action";
import { ManageBrandsTab } from "@/module/dashboard/asset-management/asset-category-details/components/tabs/manage-brands-tab";
import type { AssetCategoryDetailsTabValue } from "@/module/dashboard/asset-management/asset-category-details/data";
import type { AssetCategoryType } from "@/types/asset-management.type";

type AssetCategoryDetailsTabView = {
  slots: {
    action?: (assetCategory: AssetCategoryType) => ReactElement;
    content: (assetCategory: AssetCategoryType) => ReactElement;
  };
};

export const ASSET_CATEGORY_DETAILS_TAB_COMPONENTS: Record<
  AssetCategoryDetailsTabValue,
  AssetCategoryDetailsTabView
> = {
  "manage-brands": {
    slots: {
      action: (assetCategory) => <AddNewBrandAction assetCategory={assetCategory} />,
      content: (assetCategory) => <ManageBrandsTab assetCategory={assetCategory} />,
    },
  },
};
