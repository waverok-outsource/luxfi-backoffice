"use client";

import type { ReactElement } from "react";

import { AddAssetClassAction } from "@/module/dashboard/asset-management/components/tab-actions/add-asset-class-action";
import { SystemAssetsPortfolio } from "@/module/dashboard/asset-management/components/tabs/system-assets-portfolio";
import { UserAssetsPortfolioTab } from "@/module/dashboard/asset-management/components/tabs/user-assets-portfolio";
import { VerificationLogsTab } from "@/module/dashboard/asset-management/components/tabs/verification-logs-tab";
import type { AssetManagementTabValue } from "@/module/dashboard/asset-management/data";

type AssetManagementTabView = {
  slots: {
    action?: () => ReactElement;
    content: () => ReactElement;
  };
};

export const ASSET_MANAGEMENT_TAB_COMPONENTS: Record<AssetManagementTabValue, AssetManagementTabView> = {
  "system-assets-portfolio": {
    slots: {
      action: AddAssetClassAction,
      content: SystemAssetsPortfolio,
    },
  },
  "user-assets-portfolio": {
    slots: {
      content: UserAssetsPortfolioTab,
    },
  },
  "verification-logs": {
    slots: {
      content: VerificationLogsTab,
    },
  },
};
