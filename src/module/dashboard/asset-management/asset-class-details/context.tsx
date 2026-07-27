"use client";

import * as React from "react";

import { mockAssetItemsByClassId } from "@/module/dashboard/asset-management/data";
import type { AssetItemType } from "@/types/asset-management.type";

type AssetItemsContextValue = {
  items: AssetItemType[];
  addItem: (item: AssetItemType) => void;
  updateItem: (assetItemId: string, patch: Partial<AssetItemType>) => void;
  removeItem: (assetItemId: string) => void;
};

const AssetItemsContext = React.createContext<AssetItemsContextValue | null>(null);

export function AssetItemsProvider({
  assetClassId,
  children,
}: {
  assetClassId: string;
  children: React.ReactNode;
}) {
  const [items, setItems] = React.useState<AssetItemType[]>(
    () => mockAssetItemsByClassId[assetClassId] ?? [],
  );

  const addItem = React.useCallback((item: AssetItemType) => {
    setItems((previous) => [item, ...previous]);
  }, []);

  const updateItem = React.useCallback((assetItemId: string, patch: Partial<AssetItemType>) => {
    setItems((previous) =>
      previous.map((item) => (item.assetItemId === assetItemId ? { ...item, ...patch } : item)),
    );
  }, []);

  const removeItem = React.useCallback((assetItemId: string) => {
    setItems((previous) => previous.filter((item) => item.assetItemId !== assetItemId));
  }, []);

  const value = React.useMemo(
    () => ({ items, addItem, updateItem, removeItem }),
    [items, addItem, updateItem, removeItem],
  );

  return <AssetItemsContext.Provider value={value}>{children}</AssetItemsContext.Provider>;
}

export function useAssetItemsContext() {
  const context = React.useContext(AssetItemsContext);

  if (!context) {
    throw new Error("useAssetItemsContext must be used within AssetItemsProvider");
  }

  return context;
}
