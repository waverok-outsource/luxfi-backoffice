"use client";

import { AlertTriangle, Check } from "lucide-react";
import type * as React from "react";

import { ModalDetailRow } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { formatDateLabel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OFFER_MODAL_STATUS_LABELS, OFFER_TABLE_STATUS_CONFIG } from "@/module/dashboard/marketplace/data";
import type { OfferStatus } from "@/types/marketplace.type";
import { formatCurrency } from "@/util/format-currency";

type ModalStatusBadgeProps = {
  variant: "success" | "warning" | "error";
  label: string;
};

/** Status badge used in every review modal — icon is inferred from the tone of the status. */
export function ModalStatusBadge({ variant, label }: ModalStatusBadgeProps) {
  if (variant === "success") {
    return (
      <Badge variant={variant} className="gap-1">
        <Check className="h-3 w-3" />
        {label}
      </Badge>
    );
  }

  if (variant === "error") {
    return (
      <Badge variant={variant} className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant={variant} showStatusDot>
      {label}
    </Badge>
  );
}

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return <ModalStatusBadge variant={OFFER_TABLE_STATUS_CONFIG[status].variant} label={OFFER_MODAL_STATUS_LABELS[status]} />;
}

type OfferSummaryCardProps = {
  statusBadge: React.ReactNode;
  orderId: string;
  /** Seller/buyer rows rendered under the Order ID — callers pass as many parties as the flow has. */
  parties: Array<{ label: string; value: string }>;
  primaryPriceLabel: string;
  primaryPriceValue: number;
  secondaryPriceLabel: string;
  /** Pass null when the backend has no equivalent value (e.g. P2P's "Seller Accepted Offer") — renders "-" rather than a fabricated $0.00. */
  secondaryPriceValue: number | null;
  /** Omit to hide the Offer Date / resolution date block (e.g. P2P trades). */
  dates?: {
    submittedAt: string;
    isPending: boolean;
    resolvedAt?: string;
    resolvedDateLabel: string;
  };
};

/**
 * The "Buy Offer Details" white-card block shared by every offer-review modal
 * (Liquidation Offers, Buy Offers, P2P Trades, ...) — differs only in labels/values per caller.
 */
export function OfferSummaryCard({
  statusBadge,
  orderId,
  parties,
  primaryPriceLabel,
  primaryPriceValue,
  secondaryPriceLabel,
  secondaryPriceValue,
  dates,
}: OfferSummaryCardProps) {
  return (
    <div className="space-y-3 rounded-2xl bg-primary-white p-4">
      <ModalDetailRow label="Status" value={statusBadge} />
      <ModalDetailRow label="Order ID:" value={orderId} />
      {parties.map((party) => (
        <ModalDetailRow key={party.label} label={party.label} value={party.value} />
      ))}

      <div className="space-y-3 border-t border-primary-grey-stroke pt-3">
        <ModalDetailRow label={primaryPriceLabel} value={formatCurrency(primaryPriceValue)} />
        <ModalDetailRow
          label={secondaryPriceLabel}
          value={secondaryPriceValue == null ? "-" : formatCurrency(secondaryPriceValue)}
        />
      </div>

      {dates ? (
        <div className="space-y-3 border-t border-primary-grey-stroke pt-3">
          <ModalDetailRow label="Offer Date" value={dates.isPending ? "-" : formatDateLabel(dates.submittedAt)} />
          <ModalDetailRow
            label={dates.resolvedDateLabel}
            value={dates.resolvedAt ? formatDateLabel(dates.resolvedAt) : "-"}
          />
        </div>
      ) : null}
    </div>
  );
}
