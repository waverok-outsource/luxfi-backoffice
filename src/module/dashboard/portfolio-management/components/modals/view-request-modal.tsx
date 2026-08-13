"use client";

import { AssetRequestDetailsModalShell } from "@/module/dashboard/portfolio-management/components/modals/asset-request-details-modal-shell";
import type {
  PortfolioStatus,
  PortfolioTableRow,
} from "@/module/dashboard/portfolio-management/data";

type RequestRow = PortfolioTableRow & {
  customerName?: string;
  assetId?: string;
  assetName?: string;
  pawnOfferValue?: string;
  requestDate?: string;
  status?: PortfolioStatus;
};

type ViewRequestModalProps = {
  variant: "purchase" | "sale";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestRow;
};

const REQUEST_MODAL_CONFIG = {
  purchase: {
    title: "Asset Purchase Request",
    description: "View and manage customer order request here",
    requestIdLabel: "Order ID:",
    partyNameLabel: "Buyer Name:",
    partyIdLabel: "Buyer ID:",
    priceLabel: "Pawn Price",
    rejectLabel: "Reject Order Request",
    approveLabel: "Approve Order",
  },
  sale: {
    title: "Asset Sale Request",
    description: "View and manage customer sell application here",
    requestIdLabel: "Request ID:",
    partyNameLabel: "Seller Name:",
    partyIdLabel: "Seller ID:",
    priceLabel: "Pawn Sale Price",
    rejectLabel: "Reject Sale Request",
    approveLabel: "Approve Sale Request",
  },
} satisfies Record<
  ViewRequestModalProps["variant"],
  {
    title: string;
    description: string;
    requestIdLabel: string;
    partyNameLabel: string;
    partyIdLabel: string;
    priceLabel: string;
    rejectLabel: string;
    approveLabel: string;
  }
>;

export function ViewRequestModal({ variant, open, onOpenChange, request }: ViewRequestModalProps) {
  const config = REQUEST_MODAL_CONFIG[variant];
  const price = typeof request.pawnOfferValue === "string" ? request.pawnOfferValue : undefined;
  const requestDate = typeof request.requestDate === "string" ? request.requestDate : undefined;
  const saleApprovedDate = request.status === "approved" ? requestDate : undefined;

  return (
    <AssetRequestDetailsModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      description={config.description}
      saleDetails={{
        status: request.status,
        requestId: request.id,
        requestIdLabel: config.requestIdLabel,
        partyNameLabel: config.partyNameLabel,
        partyName: request.customerName,
        partyIdLabel: config.partyIdLabel,
        priceLabel: config.priceLabel,
        price,
        requestDate,
        approvedDate: saleApprovedDate,
      }}
      assetDetails={{
        assetName: request.assetName,
        brandCategory: "Rolex (Luxury Watches)",
      }}
      actions={{
        rejectLabel: config.rejectLabel,
        approveLabel: config.approveLabel,
      }}
    />
  );
}
