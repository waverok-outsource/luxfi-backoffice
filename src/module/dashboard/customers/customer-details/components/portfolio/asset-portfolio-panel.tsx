"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";

import {
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetPortfolioModal } from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-modal";
import type {
  AssetPortfolioRecord,
  AssetPortfolioStatus,
  AssetPortfolioStep,
  AssetVerificationPayload,
} from "@/module/dashboard/customers/customer-details/components/portfolio/asset-portfolio-types";
import { formatLoanCaseMoney } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";

type AssetPortfolioRow = Pick<
  AssetPortfolioRecord,
  | "id"
  | "assetId"
  | "assetCategory"
  | "assetName"
  | "marketValue"
  | "pawnValue"
  | "dateAppliedLabel"
  | "status"
>;

const PAGE_SIZE = 5;

function getTableStatusBadge(status: AssetPortfolioStatus) {
  switch (status) {
    case "pending":
      return { variant: "warning" as const, label: "Pending" };
    case "verified":
      return { variant: "success" as const, label: "Verified" };
    case "rejected":
      return { variant: "error" as const, label: "Rejected" };
    case "notVerified":
      return { variant: "disabled" as const, label: "Not Verified" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function generateAssets(total: number): AssetPortfolioRecord[] {
  const statuses: AssetPortfolioStatus[] = [
    "pending",
    "verified",
    "rejected",
    "notVerified",
    "verified",
  ];
  const definitions = [
    {
      assetCategory: "Luxury Watch",
      assetName: "Rolex Sky-dweller 336935",
      marketValue: 10000,
      pawnValue: null,
      brandCategory: "Rolex (Luxury Watches)",
      year: "2024",
      dialColour: "Blue",
      weight: "7kg",
      box: "Yes",
      caseColour: "Rose Gold",
      caseSize: "42mm",
    },
    {
      assetCategory: "Luxury Watch",
      assetName: "Rolex Daytona",
      marketValue: 150000,
      pawnValue: 120000,
      brandCategory: "Rolex (Luxury Watches)",
      year: "2024",
      dialColour: "Blue",
      weight: "7kg",
      box: "Yes",
      caseColour: "Rose Gold",
      caseSize: "42mm",
    },
    {
      assetCategory: "Designer Bag",
      assetName: "Gucci Flip",
      marketValue: 32000,
      pawnValue: 12000,
      brandCategory: "Gucci (Designer Bags)",
      year: "2023",
      dialColour: "Brown",
      weight: "3kg",
      box: "No",
      caseColour: "Tan",
      caseSize: "Medium",
    },
    {
      assetCategory: "Luxury Watch",
      assetName: "Rolex Submariner",
      marketValue: 7000,
      pawnValue: null,
      brandCategory: "Rolex (Luxury Watches)",
      year: "2022",
      dialColour: "Black",
      weight: "6kg",
      box: "No",
      caseColour: "Silver",
      caseSize: "40mm",
    },
    {
      assetCategory: "Luxury Watch",
      assetName: "Audemars Piguet",
      marketValue: 50000,
      pawnValue: 10000,
      brandCategory: "Audemars Piguet (Luxury Watches)",
      year: "2024",
      dialColour: "Green",
      weight: "7kg",
      box: "Yes",
      caseColour: "Gold",
      caseSize: "41mm",
    },
  ] as const;

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const status = statuses[index % statuses.length] ?? "pending";
    const definition = definitions[index % definitions.length] ?? definitions[0];

    return {
      id: `asset-${serial}`,
      assetId: `CU-${String(8890955422 + serial)}...`,
      borrowerName: "Darryl Simmons",
      assetCategory: definition.assetCategory,
      assetName: definition.assetName,
      marketValue: definition.marketValue,
      pawnValue: status === "pending" || status === "notVerified" ? null : definition.pawnValue,
      dateAppliedLabel: "10/01/2026",
      marketTrendLabel: "67% | Last 7 days",
      status,
      rejectionReason: status === "rejected" ? "Asset is outdated" : undefined,
      brandCategory: definition.brandCategory,
      year: definition.year,
      dialColour: definition.dialColour,
      weight: definition.weight,
      box: definition.box,
      caseColour: definition.caseColour,
      caseSize: definition.caseSize,
      submittedDateLabel:
        status === "verified" || status === "rejected" ? "01/01/2026" : "-",
      examinationDateLabel:
        status === "verified" || status === "rejected" ? "01/01/2026" : "-",
      examinationOfficerEmail:
        status === "verified" || status === "rejected" ? "marketing@pawnshopbyblu.com" : "",
      physicalDefects: status === "verified" || status === "rejected" ? "None" : "",
      officerRemark: status === "verified" || status === "rejected" ? "Enter details Here" : "",
      certificationPapers: status === "verified" || status === "rejected" ? true : null,
      boxPackaged: status === "verified" || status === "rejected" ? true : null,
    };
  });
}

export function AssetPortfolioPanel() {
  const { value, setURLQuery } = useURLQuery<{ page?: string; search?: string }>();
  const [assets, setAssets] = React.useState<AssetPortfolioRecord[]>(() => generateAssets(1000));
  const [activeAssetId, setActiveAssetId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<AssetPortfolioStep>("INFO");
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);
  const [pendingApprovePayload, setPendingApprovePayload] =
    React.useState<AssetVerificationPayload | null>(null);

  const searchQuery = (value.search ?? "").trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!searchQuery) return assets;
    return assets.filter(
      (asset) =>
        asset.assetId.toLowerCase().includes(searchQuery) ||
        asset.assetName.toLowerCase().includes(searchQuery),
    );
  }, [assets, searchQuery]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<AssetPortfolioRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((asset) => ({
      id: asset.id,
      assetId: asset.assetId,
      assetCategory: asset.assetCategory,
      assetName: asset.assetName,
      marketValue: asset.marketValue,
      pawnValue: asset.pawnValue,
      dateAppliedLabel: asset.dateAppliedLabel,
      status: asset.status,
    }));
  }, [currentPage, filtered]);

  const activeAsset = activeAssetId
    ? assets.find((asset) => asset.id === activeAssetId) ?? null
    : null;

  const columns: ColumnDef<AssetPortfolioRow, unknown>[] = [
    createSerialColumn<AssetPortfolioRow>(),
    createIdentifierColumn<AssetPortfolioRow>("Asset ID", "assetId"),
    {
      accessorKey: "assetCategory",
      header: "Asset Category",
    },
    {
      accessorKey: "assetName",
      header: "Asset Name",
    },
    {
      accessorKey: "marketValue",
      header: "Market Value",
      cell: ({ getValue }) => <span>{formatLoanCaseMoney(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "pawnValue",
      header: "Pawn Value",
      cell: ({ getValue }) => {
        const value = getValue();
        return <span>{typeof value === "number" ? formatLoanCaseMoney(value) : "-"}</span>;
      },
    },
    {
      accessorKey: "dateAppliedLabel",
      header: "Date Applied",
    },
    {
      accessorKey: "status",
      header: "Status ID",
      cell: ({ getValue }) => {
        const badge = getTableStatusBadge(getValue() as AssetPortfolioStatus);
        return (
          <Badge variant={badge.variant} showStatusDot>
            {badge.label}
          </Badge>
        );
      },
    },
    createActionColumnWithOptions<AssetPortfolioRow>({
      ariaLabel: "View customer asset information",
      onView: (row) => {
        setActiveAssetId(row.id);
        setStep("INFO");
        setResultMessage(null);
        setModalOpen(true);
      },
    }),
  ];

  const handleRequestApprove = (payload: AssetVerificationPayload) => {
    setPendingApprovePayload(payload);
    setStep("APPROVE_CONFIRM");
  };

  const handleConfirmApprove = () => {
    if (!pendingApprovePayload) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === pendingApprovePayload.assetId
          ? {
              ...asset,
              status: "verified",
              pawnValue: pendingApprovePayload.pawnValue,
              submittedDateLabel: pendingApprovePayload.submittedDateLabel,
              examinationDateLabel: pendingApprovePayload.examinationDateLabel,
              examinationOfficerEmail: pendingApprovePayload.examinationOfficerEmail,
              physicalDefects: pendingApprovePayload.physicalDefects,
              officerRemark: pendingApprovePayload.officerRemark,
              certificationPapers: pendingApprovePayload.certificationPapers,
              boxPackaged: pendingApprovePayload.boxPackaged,
              rejectionReason: undefined,
            }
          : asset,
      ),
    );

    setPendingApprovePayload(null);
    setStep("RESULT");
    setResultMessage({
      title: "Asset Verification Approved",
      description: "The selected asset has been marked as verified successfully.",
    });
  };

  const handleConfirmReject = (reason: string) => {
    if (!activeAssetId) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === activeAssetId
          ? {
              ...asset,
              status: "rejected",
              rejectionReason: reason,
            }
          : asset,
      ),
    );

    setStep("RESULT");
    setResultMessage({
      title: "Asset Verification Rejected",
      description: `Reason for Rejection: ${reason}`,
    });
  };

  const handleUnverify = () => {
    if (!activeAssetId) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === activeAssetId
          ? {
              ...asset,
              status: "notVerified",
              pawnValue: null,
            }
          : asset,
      ),
    );
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setStep("INFO");
      setResultMessage(null);
      setPendingApprovePayload(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search Asset ID"
            value={value.search ?? ""}
            onChange={(event) =>
              setURLQuery({
                search: event.target.value || undefined,
                page: "1",
              })
            }
            startAdornment={<Search className="h-5 w-5 text-text-grey" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
          >
            Filter Options
            <ChevronDown className="h-4 w-4 text-text-grey" />
          </Button>
        </div>
      </div>

      <DataTable<AssetPortfolioRow, unknown>
        columns={columns}
        data={rows}
        enableCheckbox
        pagination={{
          totalEntries: filtered.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeAsset ? (
        <AssetPortfolioModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          asset={activeAsset}
          step={step}
          onStepChange={setStep}
          onRequestApprove={handleRequestApprove}
          onConfirmApprove={handleConfirmApprove}
          onConfirmReject={handleConfirmReject}
          onUnverify={handleUnverify}
          resultMessage={resultMessage}
        />
      ) : null}
    </div>
  );
}
