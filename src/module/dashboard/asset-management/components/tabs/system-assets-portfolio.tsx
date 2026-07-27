"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetClassCard } from "@/module/dashboard/asset-management/components/asset-class-card";
import { AddAssetClassModal } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal";
import { useAssetClasses } from "@/services/queries/asset-management.queries";
import type { AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import route from "@/util/route";

type SystemAssetsPortfolioQuery = {
  q?: string;
  type?: string;
};

export function SystemAssetsPortfolio() {
  const router = useRouter();
  const { value } = useURLQuery<SystemAssetsPortfolioQuery>();
  const [editingAssetClass, setEditingAssetClass] = React.useState<AssetClassType | null>(null);

  const searchQuery = (value.q ?? "").trim();
  const assetTypeFilter = value.type && value.type !== "all" ? value.type : "";

  const listQuery = convertObjectToQuery({
    ...(searchQuery ? { q: searchQuery } : {}),
    ...(assetTypeFilter ? { assetType: assetTypeFilter } : {}),
  });

  const { data: assetClassesResponse, isLoading } = useAssetClasses(listQuery);
  const assetClasses = assetClassesResponse?.data ?? [];

  if (isLoading && !assetClasses.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary-white py-24 text-center">
        <p className="text-text-grey">Loading asset classes...</p>
      </div>
    );
  }

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
              key={assetClass.classId}
              assetClass={assetClass}
              onEdit={() => setEditingAssetClass(assetClass)}
              onViewAssets={() =>
                router.push(`${route.dashboard.assetManagement}/${assetClass.classId}`)
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
        />
      )}
    </>
  );
}
