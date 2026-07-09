"use client";

import type { ReactElement } from "react";

import { ActivityLogTab } from "@/module/dashboard/asset-management/user-portfolios/components/tabs/activity-log-tab";
import { ListedAssetsTab } from "@/module/dashboard/asset-management/user-portfolios/components/tabs/listed-assets-tab";
import type { UserPortfolioDetailsTabValue } from "@/module/dashboard/asset-management/user-portfolios/data";

type UserPortfolioDetailsTabView = {
  slots: {
    content: (portfolioId: string) => ReactElement;
  };
};

export const USER_PORTFOLIO_DETAILS_TAB_COMPONENTS: Record<
  UserPortfolioDetailsTabValue,
  UserPortfolioDetailsTabView
> = {
  "listed-assets": {
    slots: {
      content: () => <ListedAssetsTab />,
    },
  },
  "activity-log": {
    slots: {
      content: (portfolioId) => <ActivityLogTab portfolioId={portfolioId} />,
    },
  },
};
