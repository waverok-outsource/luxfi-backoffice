"use client";

import * as React from "react";

import { mockAssetClasses } from "@/module/dashboard/asset-management/data";
import type { AssetClassType } from "@/types/asset-management.type";

type AssetClassesContextValue = {
  assetClasses: AssetClassType[];
  addAssetClass: (assetClass: AssetClassType) => void;
  updateAssetClass: (assetClassId: string, patch: Partial<AssetClassType>) => void;
};

const AssetClassesContext = React.createContext<AssetClassesContextValue | null>(null);

export function AssetClassesProvider({ children }: { children: React.ReactNode }) {
  const [assetClasses, setAssetClasses] = React.useState<AssetClassType[]>(mockAssetClasses);

  const addAssetClass = React.useCallback((assetClass: AssetClassType) => {
    setAssetClasses((previous) => [assetClass, ...previous]);
  }, []);

  const updateAssetClass = React.useCallback((assetClassId: string, patch: Partial<AssetClassType>) => {
    setAssetClasses((previous) =>
      previous.map((assetClass) =>
        assetClass.assetClassId === assetClassId ? { ...assetClass, ...patch } : assetClass,
      ),
    );
  }, []);

  const value = React.useMemo(
    () => ({ assetClasses, addAssetClass, updateAssetClass }),
    [assetClasses, addAssetClass, updateAssetClass],
  );

  return <AssetClassesContext.Provider value={value}>{children}</AssetClassesContext.Provider>;
}

export function useAssetClassesContext() {
  const context = React.useContext(AssetClassesContext);

  if (!context) {
    throw new Error("useAssetClassesContext must be used within AssetClassesProvider");
  }

  return context;
}
