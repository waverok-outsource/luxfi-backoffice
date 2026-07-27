"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AssetCategoryConfigurationModal } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-category-configuration-modal";
import type { AssetClassType } from "@/types/asset-management.type";

type AddNewCategoryActionProps = {
  assetClass: AssetClassType;
};

export function AddNewCategoryAction({ assetClass }: AddNewCategoryActionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add New Category
      </Button>

      {isOpen && (
        <AssetCategoryConfigurationModal
          mode="create"
          open={isOpen}
          onOpenChange={setIsOpen}
          assetClass={assetClass}
        />
      )}
    </>
  );
}
