"use client";

import * as React from "react";
import { Flag, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { AddAssetClassModal } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal";
import type { AssetClassType } from "@/types/asset-management.type";

type AssetClassDetailsHeaderProps = {
  assetClass: AssetClassType;
  onBack: () => void;
  onAssetClassUpdated: (assetClassId: string, patch: Partial<AssetClassType>) => void;
};

export function AssetClassDetailsHeader({
  assetClass,
  onBack,
  onAssetClassUpdated,
}: AssetClassDetailsHeaderProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <>
      <DetailBreadcrumbHeader
        title="LuxFi Inventory"
        entityId={assetClass.name}
        idPrefix=""
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="grey-stroke"
              className="h-12 rounded-2xl"
              onClick={() => setIsEditOpen(true)}
            >
              <Settings2 className="h-5 w-5" />
              Edit
            </Button>
            <Button type="button" variant="danger" className="h-12 rounded-2xl">
              <Flag className="h-5 w-5" />
              Flag
            </Button>
          </div>
        }
      />

      {isEditOpen && (
        <AddAssetClassModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          assetClass={assetClass}
          onAssetClassUpdated={onAssetClassUpdated}
        />
      )}
    </>
  );
}
