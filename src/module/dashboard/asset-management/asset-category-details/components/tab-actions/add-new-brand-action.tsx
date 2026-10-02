"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AssetBrandConfigurationModal } from "@/module/dashboard/asset-management/asset-category-details/components/modals/asset-brand-configuration-modal";
import type { AssetCategoryType } from "@/types/asset-management.type";

type AddNewBrandActionProps = {
  assetCategory: AssetCategoryType;
};

export function AddNewBrandAction({ assetCategory }: AddNewBrandActionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add New Brand
      </Button>

      {isOpen && (
        <AssetBrandConfigurationModal
          mode="create"
          open={isOpen}
          onOpenChange={setIsOpen}
          assetCategory={assetCategory}
        />
      )}
    </>
  );
}
