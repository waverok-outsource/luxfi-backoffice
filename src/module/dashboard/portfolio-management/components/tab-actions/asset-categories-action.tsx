"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddAssetCategoryModal } from "@/module/dashboard/portfolio-management/components/modals/add-asset-category-modal";

export function AssetCategoriesAction() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsAddCategoryOpen(true)}>
        Add New Category
      </Button>

      {isAddCategoryOpen && (
        <AddAssetCategoryModal
          open={isAddCategoryOpen}
          onOpenChange={setIsAddCategoryOpen}
        />
      )}
    </>
  );
}

