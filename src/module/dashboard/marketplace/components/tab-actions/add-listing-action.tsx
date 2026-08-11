"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddToMarketplaceModal } from "@/module/dashboard/marketplace/components/modals/add-to-marketplace-modal";

export function AddListingAction() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add New Listing
      </Button>

      {isOpen && (
        <AddToMarketplaceModal open={isOpen} onOpenChange={setIsOpen} />
      )}
    </>
  );
}
