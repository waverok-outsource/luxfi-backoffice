"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddAssetBrandModal } from "@/module/dashboard/portfolio-management/components/modals/add-asset-brand-modal";

export function AssetBrandsAction() {
  const [isAddBrandOpen, setIsAddBrandOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsAddBrandOpen(true)}>
        Add New Brand
      </Button>

      {isAddBrandOpen && (
        <AddAssetBrandModal open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen} />
      )}
    </>
  );
}
