"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AssetItemConfigurationModal } from "@/module/dashboard/asset-management/asset-class-details/components/modals/asset-item-configuration-modal";
import { useAssetItemsContext } from "@/module/dashboard/asset-management/asset-class-details/context";
import type { AssetClassType } from "@/types/asset-management.type";

type AddNewAssetActionProps = {
  assetClass: AssetClassType;
};

export function AddNewAssetAction({ assetClass }: AddNewAssetActionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addItem } = useAssetItemsContext();

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add New Asset
      </Button>

      {isOpen && (
        <AssetItemConfigurationModal
          mode="create"
          open={isOpen}
          onOpenChange={setIsOpen}
          assetClass={assetClass}
          onAssetItemCreated={addItem}
        />
      )}
    </>
  );
}
