"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddAssetModal } from "@/module/dashboard/portfolio-management/components/modals/add-asset-modal";

export function PortfolioInventoryAction() {
  const [isAddAssetOpen, setIsAddAssetOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsAddAssetOpen(true)}>
        Add New Asset
      </Button>

      {isAddAssetOpen && <AddAssetModal open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen} />}
    </>
  );
}
