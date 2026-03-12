"use client";

import { AssetRequestDetailsModalShell } from "@/module/dashboard/portfolio-management/components/modals/asset-request-details-modal-shell";
import type {
  PortfolioStatus,
  PortfolioTableRow,
} from "@/module/dashboard/portfolio-management/data";

type PurchaseRequestRow = PortfolioTableRow & {
  customerName?: string;
  assetId?: string;
  assetName?: string;
  pawnOfferValue?: string;
  orderDate?: string;
  status?: PortfolioStatus;
};

type ViewPurchaseRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PurchaseRequestRow;
};

export function ViewPurchaseRequestModal({
  open,
  onOpenChange,
  request,
}: ViewPurchaseRequestModalProps) {
  const pawnPrice = typeof request.pawnOfferValue === "string" ? request.pawnOfferValue : undefined;
  const requestDate = typeof request.orderDate === "string" ? request.orderDate : undefined;
  const saleApprovedDate = request.status === "approved" ? requestDate : undefined;

  return (
    <AssetRequestDetailsModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Asset Purchase Request"
      description="View and manage customer order request here"
      saleDetails={{
        status: request.status,
        requestId: request.id,
        requestIdLabel: "Order ID:",
        partyNameLabel: "Buyer Name:",
        partyName: request.customerName,
        partyIdLabel: "Buyer ID:",
        priceLabel: "Pawn Price",
        price: pawnPrice,
        requestDate,
        approvedDate: saleApprovedDate,
      }}
      assetDetails={{
        assetName: request.assetName,
        brandCategory: "Rolex (Luxury Watches)",
      }}
      actions={{
        rejectLabel: "Reject Order Request",
        approveLabel: "Approve Order",
      }}
    />
  );
}
