"use client";

import * as React from "react";

import { mockAssetCategoriesByClassId, mockAssetItemsByClassId } from "@/module/dashboard/asset-management/data";
import type { AssetCategoryType, AssetItemType } from "@/types/asset-management.type";

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

type AssetCategoriesContextValue = {
  categories: AssetCategoryType[];
  addCategory: (category: AssetCategoryType) => void;
  updateCategory: (assetCategoryId: string, patch: Partial<AssetCategoryType>) => void;
  removeCategory: (assetCategoryId: string) => void;
};

const AssetCategoriesContext = React.createContext<AssetCategoriesContextValue | null>(null);

export function AssetCategoriesProvider({
  assetClassId,
  children,
}: {
  assetClassId: string;
  children: React.ReactNode;
}) {
  const [categories, setCategories] = React.useState<AssetCategoryType[]>(
    () => mockAssetCategoriesByClassId[assetClassId] ?? [],
  );

  const addCategory = React.useCallback((category: AssetCategoryType) => {
    setCategories((previous) => [category, ...previous]);
  }, []);

  const updateCategory = React.useCallback(
    (assetCategoryId: string, patch: Partial<AssetCategoryType>) => {
      setCategories((previous) =>
        previous.map((category) =>
          category.assetCategoryId === assetCategoryId ? { ...category, ...patch } : category,
        ),
      );
    },
    [],
  );

  const removeCategory = React.useCallback((assetCategoryId: string) => {
    setCategories((previous) => previous.filter((category) => category.assetCategoryId !== assetCategoryId));
  }, []);

  const value = React.useMemo(
    () => ({ categories, addCategory, updateCategory, removeCategory }),
    [categories, addCategory, updateCategory, removeCategory],
  );

  return <AssetCategoriesContext.Provider value={value}>{children}</AssetCategoriesContext.Provider>;
}

export function useAssetCategoriesContext() {
  const context = React.useContext(AssetCategoriesContext);

  if (!context) {
    throw new Error("useAssetCategoriesContext must be used within AssetCategoriesProvider");
  }

  return context;
}
