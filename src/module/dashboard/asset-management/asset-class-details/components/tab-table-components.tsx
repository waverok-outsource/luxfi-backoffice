"use client";

import type { ReactElement } from "react";

import { AddNewAssetAction } from "@/module/dashboard/asset-management/asset-class-details/components/tab-actions/add-new-asset-action";
import { AddNewCategoryAction } from "@/module/dashboard/asset-management/asset-class-details/components/tab-actions/add-new-category-action";
import { ManageAssetsTab } from "@/module/dashboard/asset-management/asset-class-details/components/tabs/manage-assets-tab";
import { ManageCategoriesTab } from "@/module/dashboard/asset-management/asset-class-details/components/tabs/manage-categories-tab";
import type { AssetClassDetailsTabValue } from "@/module/dashboard/asset-management/asset-class-details/data";
import type { AssetClassType } from "@/types/asset-management.type";

type AssetClassDetailsTabView = {
  slots: {
    action?: (assetClass: AssetClassType) => ReactElement;
    content: (assetClass: AssetClassType) => ReactElement;
  };
};

export const ASSET_CLASS_DETAILS_TAB_COMPONENTS: Record<
  AssetClassDetailsTabValue,
  AssetClassDetailsTabView
> = {
  "manage-assets": {
    slots: {
      action: (assetClass) => <AddNewAssetAction assetClass={assetClass} />,
      content: (assetClass) => <ManageAssetsTab assetClass={assetClass} />,
    },
  },
  "manage-categories": {
    slots: {
      action: (assetClass) => <AddNewCategoryAction assetClass={assetClass} />,
      content: (assetClass) => <ManageCategoriesTab assetClass={assetClass} />,
    },
  },
};
