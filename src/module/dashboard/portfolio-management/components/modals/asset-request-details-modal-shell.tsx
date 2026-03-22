"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { ModalShell } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { DataRow } from "@/components/ui/data-row";
import type { PortfolioStatus } from "@/module/dashboard/portfolio-management/data";

export type SaleDetailsConfig = {
  status?: PortfolioStatus;
  requestId?: string;
  requestIdLabel: string;
  partyNameLabel: string;
  partyName?: string;
  partyIdLabel: string;
  partyId?: string;
  priceLabel: string;
  price?: string;
  requestDateLabel?: string;
  requestDate?: string;
  approvedDateLabel?: string;
  approvedDate?: string;
};

export type AssetDetailsConfig = {
  assetName?: string;
  brandCategory?: string;
};

export type RequestDetailsActionsConfig = {
  rejectLabel: string;
  approveLabel: string;
  onReject?: () => void;
  onApprove?: () => void;
};

type AssetRequestDetailsModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  shellClassName?: string;
  saleDetails: SaleDetailsConfig;
  assetDetails?: AssetDetailsConfig;
  actions: RequestDetailsActionsConfig;
};

function getStatusBadge(status?: PortfolioStatus) {
  switch (status) {
    case "pending":
      return { label: "Pending Approval", variant: "warning" as const };
    case "approved":
      return { label: "Approved", variant: "success" as const };
    case "rejected":
      return { label: "Rejected", variant: "error" as const };
    default:
      return { label: "Unknown", variant: "neutral" as const };
  }
}

function normalizeToEmail(name?: string) {
  const normalized =
    typeof name === "string" ? name.toLowerCase().replaceAll(" ", "").replaceAll(".", "") : "";
  if (!normalized) return "-";
  return `${normalized}@gmail.com`;
}

function VerifiedBadge() {
  return (
    <Badge variant="success" className="gap-2 pl-2 pr-3">
      <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-alert-success text-primary-white">
        <Check className="size-3" />
      </span>
      Verified
    </Badge>
  );
}

export function AssetRequestDetailsModalShell(props: AssetRequestDetailsModalShellProps) {
  const { saleDetails, assetDetails = {}, actions } = props;
  const statusBadge = getStatusBadge(saleDetails.status);
  const resolvedPartyId = saleDetails.partyId ?? normalizeToEmail(saleDetails.partyName);

  const requestDateLabel = saleDetails.requestDateLabel ?? "Request Date";
  const approvedDateLabel = saleDetails.approvedDateLabel ?? "Sale Approved Date";
  const requestDateValue = saleDetails.requestDate ?? "-";
  const approvedDateValue = saleDetails.approvedDate ?? "-";
  const priceValue = saleDetails.price ?? "-";

  const assetName = typeof assetDetails.assetName === "string" ? assetDetails.assetName : "-";
  const brandCategory =
    typeof assetDetails.brandCategory === "string" ? assetDetails.brandCategory : "-";

  const handleReject = () => {
    actions.onReject?.();
    props.onOpenChange(false);
  };

  const handleApprove = () => {
    actions.onApprove?.();
    props.onOpenChange(false);
  };

  return (
    <ModalShell.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName={props.shellClassName ?? "max-w-[563px] p-4 sm:p-6"}
    >
      <div className="space-y-5">
        <ModalShell.Header
          title={props.title}
          description={props.description}
          showBackButton
          onBack={() => props.onOpenChange(false)}
        />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-black">Sale Details</h3>
          <ModalShell.Body className="space-y-4">
            <DataRow
              label="Status"
              value={
                <Badge showStatusDot variant={statusBadge.variant}>
                  {statusBadge.label}
                </Badge>
              }
            />

            <DataRow
              label={saleDetails.requestIdLabel}
              value={saleDetails.requestId ? `ID ${saleDetails.requestId}` : "-"}
            />
            <DataRow
              label={saleDetails.partyNameLabel}
              value={String(saleDetails.partyName ?? "-")}
            />
            <DataRow label={saleDetails.partyIdLabel} value={resolvedPartyId} />

            <div className="border-t border-primary-grey-stroke pt-4">
              <div className="flex items-end justify-between gap-4">
                <span className="text-text-grey text-sm">{saleDetails.priceLabel}</span>
                <span className="text-text-black text-2xl font-semibold">{priceValue}</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-primary-grey-stroke pt-4">
              <DataRow label={requestDateLabel} value={requestDateValue} />
              <DataRow label={approvedDateLabel} value={approvedDateValue} />
            </div>
          </ModalShell.Body>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-black">Asset Details</h3>

          <ModalShell.Body className="space-y-4">
            <div className="flex justify-end">
              <VerifiedBadge />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone"
                >
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(0,0,0,0.04),rgba(0,0,0,0.0))]" />
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-primary-grey-stroke pt-4">
              <DataRow label="Asset Name:" value={assetName} />
              <DataRow label="Brand (Category):" value={brandCategory} />
            </div>

            <div className="space-y-3 border-t border-primary-grey-stroke pt-4">
              <DataRow label="Year" value="2024" />
              <DataRow label="Box" value="Yes" />
              <DataRow label="Dial Colour" value="Blue" />
              <DataRow label="Case Colour" value="Rose Gold" />
              <DataRow label="Weight" value="7kg" />
              <DataRow label="Case Size" value="42mm" />
            </div>
          </ModalShell.Body>
        </div>

        <ModalShell.Footer className="pt-4">
          <ModalShell.Action type="button" variant="danger" onClick={handleReject}>
            {actions.rejectLabel}
          </ModalShell.Action>
          <ModalShell.Action type="button" variant="success" onClick={handleApprove}>
            {actions.approveLabel}
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
