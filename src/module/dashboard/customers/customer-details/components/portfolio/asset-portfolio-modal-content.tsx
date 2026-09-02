"use client";

import { ModalShell } from "@/components/modal";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/module/dashboard/customers/customer-details/components/portfolio/image-gallery";
import {
  LoanCaseCard,
  LoanCaseDetailRow,
  LoanCaseSection,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import type { CustomerAssetType, CustomerAssetStatus } from "@/types/customer-asset.type";
import { formatCurrency } from "@/util/format-currency";
import { resolveAssetClassLabel } from "@/util/helper";

function getStatusBadge(status: CustomerAssetStatus): { variant: BadgeVariant; label: string } {
  switch (status) {
    case "pending":
      return { variant: "warning", label: "Pending Verification" };
    case "verified":
      return { variant: "success", label: "Verified" };
    case "rejected":
      return { variant: "error", label: "Rejected" };
    case "notVerified":
      return { variant: "disabled", label: "Not Verified" };
    default:
      return { variant: "disabled", label: "-" };
  }
}

function ValuationTile({ label, value, currencyCode }: { label: string; value: number; currencyCode?: string }) {
  return (
    <div className="rounded-2xl bg-primary-grey-undertone p-4">
      <p className="text-xs font-semibold text-text-grey">{label}</p>
      <p className="mt-2 text-lg font-bold text-text-black">{formatCurrency(value, currencyCode)}</p>
    </div>
  );
}

function AssetDetailsCard({ asset }: { asset: CustomerAssetType }) {
  const statusBadge = getStatusBadge(asset.status);

  return (
    <LoanCaseSection title="Asset Description">
      <LoanCaseCard className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <ImageGallery images={asset.uploads} assetName={asset.name} />
          </div>
          <Badge variant={statusBadge.variant} showStatusDot className="shrink-0">
            {statusBadge.label}
          </Badge>
        </div>

        <div className="space-y-2 border-t border-primary-grey-stroke pt-4">
          <LoanCaseDetailRow label="Asset Name:" value={asset.name} />
          <LoanCaseDetailRow label="Asset ID:" value={asset.assetId} />
          <LoanCaseDetailRow label="Asset Class:" value={resolveAssetClassLabel(asset)} />
        </div>

        <div className="grid gap-3 border-t border-primary-grey-stroke pt-4 md:grid-cols-2">
          <LoanCaseDetailRow label="Year" value={asset.productionYear} />
          <LoanCaseDetailRow label="Box" value={asset.isBoxed ? "Yes" : "No"} />
          <LoanCaseDetailRow label="Dial Colour" value={asset.dialColour} />
          <LoanCaseDetailRow label="Case Colour" value={asset.case?.colour ?? "-"} />
          <LoanCaseDetailRow
            label="Weight"
            value={asset.weight ? `${asset.weight.value}${asset.weight.unit}` : "-"}
          />
          <LoanCaseDetailRow
            label="Case Size"
            value={asset.case ? `${asset.case.size}${asset.case.unit}` : "-"}
          />
        </div>
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

function AssetValuationCard({ asset }: { asset: CustomerAssetType }) {
  return (
    <LoanCaseSection title="Asset Valuation">
      <LoanCaseCard className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ValuationTile
          label="Asset Market Price"
          value={asset.price.value}
          currencyCode={asset.price.currencyCode}
        />
        {asset.pawnValuationPrice ? (
          <ValuationTile
            label="Initial Loan Offer"
            value={asset.pawnValuationPrice.value}
            currencyCode={asset.pawnValuationPrice.currencyCode}
          />
        ) : null}
      </LoanCaseCard>
    </LoanCaseSection>
  );
}

export function AssetPortfolioViewContent({
  asset,
  onClose,
}: {
  asset: CustomerAssetType;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Customer Asset Information"
        description="View and manage customer asset here"
        showBackButton
        onBack={onClose}
        className="border-b border-primary-grey-stroke pb-5 pl-0"
        descriptionClassName="text-sm text-text-grey"
      />

      <div className="space-y-4">
        <AssetDetailsCard asset={asset} />
        <AssetValuationCard asset={asset} />
      </div>

      <div className="flex justify-end border-t border-primary-grey-stroke pt-4">
        <Button type="button" className="h-12 min-w-[120px] rounded-2xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
