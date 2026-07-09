"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddAssetClassModal } from "@/module/dashboard/asset-management/components/modals/add-asset-class-modal";
import { useAssetClassesContext } from "@/module/dashboard/asset-management/context";

export function AddAssetClassAction() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addAssetClass } = useAssetClassesContext();

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add Asset Class
      </Button>

      {isOpen && (
        <AddAssetClassModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onAssetClassCreated={addAssetClass}
        />
      )}
    </>
  );
}
