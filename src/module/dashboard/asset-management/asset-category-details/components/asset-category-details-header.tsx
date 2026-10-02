"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { AssetCategoryConfigurationModal } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-category-configuration-modal";
import type { AssetCategoryType, AssetClassType } from "@/types/asset-management.type";

type AssetCategoryDetailsHeaderProps = {
  assetClass: AssetClassType;
  assetCategory: AssetCategoryType;
  onBack: () => void;
};

export function AssetCategoryDetailsHeader({
  assetClass,
  assetCategory,
  onBack,
}: AssetCategoryDetailsHeaderProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <>
      <DetailBreadcrumbHeader
        title={assetClass.name}
        entityId={assetCategory.name}
        idPrefix=""
        onBack={onBack}
        actions={
          <Button
            type="button"
            variant="grey-stroke"
            className="h-12 rounded-2xl"
            onClick={() => setIsEditOpen(true)}
          >
            <Settings2 className="h-5 w-5" />
            Edit
          </Button>
        }
      />

      {isEditOpen && (
        <AssetCategoryConfigurationModal
          mode="edit"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          assetClass={assetClass}
          assetCategory={assetCategory}
        />
      )}
    </>
  );
}
