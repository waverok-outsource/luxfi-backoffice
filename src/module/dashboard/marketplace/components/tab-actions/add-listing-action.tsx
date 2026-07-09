"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AddToMarketplaceModal } from "@/module/dashboard/marketplace/components/modals/add-to-marketplace-modal";
import { useMarketplaceListingsContext } from "@/module/dashboard/marketplace/context";

export function AddListingAction() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addListing } = useMarketplaceListingsContext();

  return (
    <>
      <Button className="h-12 rounded-2xl px-5" onClick={() => setIsOpen(true)}>
        Add New Listing
      </Button>

      {isOpen && (
        <AddToMarketplaceModal open={isOpen} onOpenChange={setIsOpen} onListingCreated={addListing} />
      )}
    </>
  );
}
