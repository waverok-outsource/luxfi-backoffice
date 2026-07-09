"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AssetClassCard } from "@/module/dashboard/asset-management/components/asset-class-card";
import { AddAssetClassModal } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal";
import { useAssetClassesContext } from "@/module/dashboard/asset-management/context";
import type { AssetClassType } from "@/types/asset-management.type";
import route from "@/util/route";

export function SystemAssetsPortfolio() {
  const router = useRouter();
  const { assetClasses, updateAssetClass } = useAssetClassesContext();
  const [editingAssetClass, setEditingAssetClass] = React.useState<AssetClassType | null>(null);

  if (!assetClasses.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">No asset classes yet</p>
        <p className="text-sm text-text-grey">Add an asset class to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-primary-white p-4 md:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assetClasses.map((assetClass) => (
            <AssetClassCard
              key={assetClass.assetClassId}
              assetClass={assetClass}
              onEdit={() => setEditingAssetClass(assetClass)}
              onViewAssets={() =>
                router.push(`${route.dashboard.assetManagement}/${assetClass.assetClassId}`)
              }
            />
          ))}
        </div>
      </div>

      {editingAssetClass && (
        <AddAssetClassModal
          open={Boolean(editingAssetClass)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingAssetClass(null);
            }
          }}
          assetClass={editingAssetClass}
          onAssetClassUpdated={updateAssetClass}
        />
      )}
    </>
  );
}
