"use client";

import { ModalShell } from "@/components/modal";
import type { CustomerAssetType } from "@/types/customer-asset.type";
import { AssetPortfolioViewContent } from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal-content";

type AssetPortfolioModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: CustomerAssetType | null;
};

export function AssetPortfolioModal({ open, onOpenChange, asset }: AssetPortfolioModalProps) {
  if (!asset) return null;

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[680px] p-6"
    >
      <AssetPortfolioViewContent asset={asset} onClose={() => onOpenChange(false)} />
    </ModalShell.Root>
  );
}
