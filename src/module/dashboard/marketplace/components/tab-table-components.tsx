"use client";

import type { ReactElement } from "react";

import { AddListingAction } from "@/module/dashboard/marketplace/components/tab-actions/add-listing-action";
import { AuditLogsTable } from "@/module/dashboard/shared/components/audit-logs-table";
import { BuyOffersTab } from "@/module/dashboard/marketplace/components/tabs/buy-offers-tab";
import { CustomerListingsTab } from "@/module/dashboard/marketplace/components/tabs/customer-listings-tab";
import { LiquidationOffersTab } from "@/module/dashboard/marketplace/components/tabs/liquidation-offers-tab";
import { LuxfiListingTab } from "@/module/dashboard/marketplace/components/tabs/luxfi-listing-tab";
import { P2PTradeRequestsTab } from "@/module/dashboard/marketplace/components/tabs/p2p-trade-requests-tab";
import type { MarketplaceTabValue } from "@/module/dashboard/marketplace/data";

type MarketplaceTabView = {
  slots: {
    action?: () => ReactElement;
    content: () => ReactElement;
  };
};

export const MARKETPLACE_TAB_COMPONENTS: Record<MarketplaceTabValue, MarketplaceTabView> = {
  "luxfi-listing": {
    slots: {
      action: AddListingAction,
      content: LuxfiListingTab,
    },
  },
  "customer-listings": {
    slots: {
      content: CustomerListingsTab,
    },
  },
  "liquidation-offers": {
    slots: {
      content: LiquidationOffersTab,
    },
  },
  "buy-offers": {
    slots: {
      content: BuyOffersTab,
    },
  },
  "p2p-trade-requests": {
    slots: {
      content: P2PTradeRequestsTab,
    },
  },
  "audit-log": {
    slots: {
      content: () => <AuditLogsTable scope="assetMarket" />,
    },
  },
};
