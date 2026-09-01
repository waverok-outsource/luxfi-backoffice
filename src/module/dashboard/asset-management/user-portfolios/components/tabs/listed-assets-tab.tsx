"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
  type StatusConfig,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetVerificationModal } from "@/module/dashboard/asset-verification/asset-verification-modal";
import useCustomerAssetFns from "@/services/functions/customer-asset.fns";
import { useCustomerAssets } from "@/services/queries/customer-asset.queries";
import type { CustomerAssetType } from "@/types/customer-asset.type";
import type {
  AssetVerificationPayload,
  AssetVerificationRecord,
  AssetVerificationStatus,
} from "@/types/asset-verification.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, resolveAssetClassLabel } from "@/util/helper";

type ListedAssetRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  assetClass: string;
  dateAdded: string;
  marketValue: string;
  status: AssetVerificationStatus;
};

const STATUS_CONFIG: StatusConfig<AssetVerificationStatus> = {
  pending: { label: "Pending", variant: "warning" },
  verified: { label: "Verified", variant: "success" },
  rejected: { label: "Rejected", variant: "disabled" },
  notVerified: { label: "Not Verified", variant: "neutral" },
};

const AVAILABLE_STATUSES: AssetVerificationStatus[] = ["pending", "verified"];

const PAGE_SIZE = 10;

function toVerificationStatus(status: string | undefined): AssetVerificationStatus {
  return status === "verified" || status === "rejected" || status === "notVerified" || status === "pending"
    ? status
    : "pending";
}

function mapCustomerAssetToVerificationRecord(asset: CustomerAssetType): AssetVerificationRecord {
  const examination = asset.assetExamination;

  return {
    id: asset.assetId,
    assetId: asset.assetId,
    assetName: asset.name,
    assetClassName: resolveAssetClassLabel(asset),
    year: asset.productionYear,
    dialColour: asset.dialColour,
    weight: asset.weight ? `${asset.weight.value}${asset.weight.unit}` : "",
    caseColour: asset.case?.colour ?? "",
    caseSize: asset.case ? `${asset.case.size}${asset.case.unit}` : "",
    dateAddedLabel: formatDate(asset.createdAt, "dd/MM/yyyy"),
    images: asset.uploads ?? [],
    marketValue: asset.price?.value ?? 0,
    marketTrendLabel: "",
    costBasis: null,
    costBasisTrendLabel: null,
    initialLiquidationOffer: null,
    loanOfferAmount: asset.pawnValuationPrice?.value ?? null,
    loanOfferAprPercent: null,
    status: toVerificationStatus(asset.verificationStatus ?? asset.status),
    lastUpdatedAtLabel: asset.updatedAt ? formatDate(asset.updatedAt, "dd/MM/yyyy") : "-",
    submittedDateLabel: examination?.dateSubmitted ?? "-",
    examinationDateLabel: examination?.dateExamined ?? "-",
    examinationOfficerEmail: examination?.examinationOfficerIdentity ?? "",
    remarks: examination?.examinationOfficerRemark ?? "",
    certificationPapersAvailable: examination?.hasCertificationPapers ?? null,
    boxPackaged: examination?.isBoxPackaged ?? null,
    preOwned: null,
    anyPhysicalDefects: examination?.hasPhysicalDefects ?? null,
  };
}

type ListedAssetsTabProps = {
  customerId: string;
  assetType: string;
};

export function ListedAssetsTab({ customerId, assetType }: ListedAssetsTabProps) {
  const { reviewAsset } = useCustomerAssetFns();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeAssetId, setActiveAssetId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}),
    assetType,
  });

  const { data: response, isLoading } = useCustomerAssets(customerId, query);
  const assets = response?.data ?? [];

  const rows: ListedAssetRow[] = assets.map((asset) => ({
    id: asset.assetId,
    assetId: asset.assetId,
    assetName: asset.name,
    assetClass: resolveAssetClassLabel(asset),
    dateAdded: formatDate(asset.createdAt, "dd/MM/yyyy"),
    marketValue: formatCurrency(asset.price.value, asset.price.currencyCode),
    status: toVerificationStatus(asset.verificationStatus ?? asset.status),
  }));

  const activeAsset = activeAssetId
    ? (assets.find((asset) => asset.assetId === activeAssetId) ?? null)
    : null;
  const modalAsset = activeAsset ? mapCustomerAssetToVerificationRecord(activeAsset) : null;

  const handleSave = (payload: AssetVerificationPayload) => {
    const { targetStatus } = payload;

    if (targetStatus === "rejected") {
      reviewAsset(customerId, payload.assetId, { status: "rejected", defectComment: payload.rejectionReason });
      return;
    }

    if (targetStatus === "verified") {
      const currencyCode = activeAsset?.pawnValuationPrice?.currencyCode ?? activeAsset?.price.currencyCode ?? "USD";

      reviewAsset(customerId, payload.assetId, {
        status: "verified",
        pawnValuationPrice:
          payload.loanOfferAmount != null ? { value: payload.loanOfferAmount, currencyCode } : undefined,
        assetExamination: {
          dateSubmitted: payload.submittedDateLabel,
          dateExamined: payload.examinationDateLabel,
          examinationOfficerRemark: payload.remarks,
          examinationOfficerIdentity: payload.examinationOfficerEmail,
          hasCertificationPapers: payload.certificationPapersAvailable,
          isBoxPackaged: payload.boxPackaged,
        },
      });
      return;
    }

    // "pending" target = same-status detail update. The review endpoint only accepts
    // verified/rejected, so nothing is persisted server-side and the list stays as-is.
  };

  const handleBlacklist = () => {
    // No confirmed endpoint for blacklisting a customer asset yet — no-op (see ADR 0020).
  };

  const columns: ColumnDef<ListedAssetRow, unknown>[] = [
    createIdentifierColumn<ListedAssetRow>("Asset ID", "assetId"),
    createTextColumn<ListedAssetRow>("Asset Name", "assetName", "max-w-[180px]"),
    createTextColumn<ListedAssetRow>("Asset Class", "assetClass"),
    createTextColumn<ListedAssetRow>("Date Added", "dateAdded"),
    createTextColumn<ListedAssetRow>("Market Value", "marketValue"),
    createStatusColumn<ListedAssetRow, AssetVerificationStatus>("Status ID", STATUS_CONFIG),
    createActionColumnWithOptions<ListedAssetRow>({
      ariaLabel: "View asset information",
      onView: (row) => {
        setActiveAssetId(row.id);
        setModalOpen(true);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No listed assets found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {modalAsset ? (
        <AssetVerificationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          asset={modalAsset}
          availableStatuses={AVAILABLE_STATUSES}
          enableBlacklist
          onSave={handleSave}
          onBlacklist={handleBlacklist}
        />
      ) : null}
    </>
  );
}
