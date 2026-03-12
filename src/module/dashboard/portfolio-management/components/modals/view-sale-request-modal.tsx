"use client";

import { AssetRequestDetailsModalShell } from "@/module/dashboard/portfolio-management/components/modals/asset-request-details-modal-shell";
import type {
  PortfolioStatus,
  PortfolioTableRow,
} from "@/module/dashboard/portfolio-management/data";

type SaleRequestRow = PortfolioTableRow & {
  customerName?: string;
  assetId?: string;
  assetName?: string;
  pawnOfferValue?: string;
  requestedDate?: string;
  status?: PortfolioStatus;
};

type ViewSaleRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SaleRequestRow;
};

export function ViewSaleRequestModal({ open, onOpenChange, request }: ViewSaleRequestModalProps) {
  const pawnSalePrice =
    typeof request.pawnOfferValue === "string" ? request.pawnOfferValue : undefined;

  const requestDate = typeof request.requestedDate === "string" ? request.requestedDate : undefined;

  const saleApprovedDate = request.status === "approved" ? requestDate : undefined;

  return (
    <AssetRequestDetailsModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Asset Sale Request"
      description="View and manage customer sell application here"
      saleDetails={{
        status: request.status,
        requestId: request.id,
        requestIdLabel: "Request ID:",
        partyNameLabel: "Seller Name:",
        partyName: request.customerName,
        partyIdLabel: "Seller ID:",
        priceLabel: "Pawn Sale Price",
        price: pawnSalePrice,
        requestDate,
        approvedDate: saleApprovedDate,
      }}
      assetDetails={{
        assetName: request.assetName,
        brandCategory: "Rolex (Luxury Watches)",
      }}
      actions={{
        rejectLabel: "Reject Sale Request",
        approveLabel: "Approve Sale Request",
      }}
    />
  );
}
