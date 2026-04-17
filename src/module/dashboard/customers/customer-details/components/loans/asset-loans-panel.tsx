"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import {
  TableSearchField,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  AssetLoanModal,
  type AssetLoanStep,
} from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal";
import { type AssetLoan } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-shared";

type LoanStatus = AssetLoan["status"];

type LoanRow = Pick<
  AssetLoan,
  | "id"
  | "loanId"
  | "principalAmount"
  | "collateralType"
  | "collateralValue"
  | "ltvPercent"
  | "liquidationThresholdPercent"
  | "status"
>;

const PAGE_SIZE = 5;

function formatMoney(value: number) {
  return `$ ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStatusBadge(status: LoanStatus) {
  switch (status) {
    case "pending":
      return { variant: "warning" as const, label: "Pending" };
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "liquidated":
      return { variant: "error" as const, label: "Liquidated" };
    case "rejected":
      return { variant: "disabled" as const, label: "Rejected" };
    case "completed":
      return { variant: "success" as const, label: "Completed" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function generateLoans(total: number): AssetLoan[] {
  const statuses: LoanStatus[] = ["pending", "active", "liquidated", "rejected", "completed"];

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const status = statuses[index % statuses.length];
    const principal = [6000, 100000, 24000, 2000, 10000][index % 5] ?? 6000;
    const collateralValue = [10000, 150000, 32000, 7000, 50000][index % 5] ?? 10000;
    const ltv = [57.7, 60.9, 78.2, 82.9, 55.0][index % 5] ?? 60;

    const repaymentAmount = principal + principal * 0.2;
    const liquidationThresholdAmount = repaymentAmount;

    const currentCollateralValue =
      status === "liquidated"
        ? liquidationThresholdAmount
        : status === "active" && serial % 2 === 0
          ? liquidationThresholdAmount - 1000
          : collateralValue;

    const loan: AssetLoan = {
      id: `loan-${serial}`,
      loanId: `CU-${String(8890955422 + serial)}...`,
      borrowerName: "Darryl Simmons",
      borrowerRiskCreditScorePercent: 75,
      principalAmount: principal,
      durationLabel: "3 Weeks ( 21 Days)",
      proposedInterestLabel: `$ 19,908.00 (10%)`,
      repaymentAmount,
      disbursedDateLabel:
        status === "active" || status === "liquidated" ? "10th January, 2026" : "-",
      repaymentDueLabel:
        status === "active" || status === "liquidated" ? "5th February, 2026" : "-",
      collateralType: "Luxury Watch",
      collateralValue,
      collateralTrendLabel: "67% | Last 7 days",
      collateralVerified: true,
      collateralAssetName: "Rolex Sky-dweller  336935",
      collateralBrandCategory: "Rolex (Luxury Watches)",
      collateralYear: "2024",
      collateralDialColour: "Blue",
      collateralWeight: "7kg",
      collateralBox: "Yes",
      collateralCaseColour: "Rose Gold",
      collateralCaseSize: "42mm",
      ltvPercent: ltv,
      liquidationThresholdPercent: ltv,
      liquidationThresholdAmount,
      currentCollateralValue,
      status,
      rejectionReason: status === "rejected" ? "Asset Collateral Low" : undefined,
    };

    return loan;
  });
}

export function AssetLoansPanel() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [loans, setLoans] = React.useState<AssetLoan[]>(() => generateLoans(1000));

  const [activeLoanId, setActiveLoanId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<AssetLoanStep>("INFO");
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);

  const [pendingApprovePayload, setPendingApprovePayload] = React.useState<{
    loanId: string;
    liquidationThresholdAmount: number;
    disbursedDateLabel: string;
    repaymentDueLabel: string;
  } | null>(null);

  const searchQuery = (value.q ?? "").trim().toLowerCase();
  const filtered = (() => {
    if (!searchQuery) return loans;
    return loans.filter((loan) => loan.loanId.toLowerCase().includes(searchQuery));
  })();

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const pagedRows = (() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  })();

  const activeLoan = activeLoanId ? (loans.find((loan) => loan.id === activeLoanId) ?? null) : null;

  const rows: LoanRow[] = pagedRows.map((loan) => ({
    id: loan.id,
    loanId: loan.loanId,
    principalAmount: loan.principalAmount,
    collateralType: loan.collateralType,
    collateralValue: loan.collateralValue,
    ltvPercent: loan.ltvPercent,
    liquidationThresholdPercent: loan.liquidationThresholdPercent,
    status: loan.status,
  }));

  const columns: ColumnDef<LoanRow, unknown>[] = [
    createSerialColumn<LoanRow>(),
    createIdentifierColumn<LoanRow>("Loan ID", "loanId"),
    {
      accessorKey: "principalAmount",
      header: "Loan Value",
      cell: ({ getValue }) => <span>{formatMoney(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "collateralType",
      header: "Collateral",
      cell: ({ getValue }) => <span className="truncate">{String(getValue() ?? "-")}</span>,
    },
    {
      accessorKey: "collateralValue",
      header: "Collateral Value",
      cell: ({ getValue }) => <span>{formatMoney(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "ltvPercent",
      header: "LTV",
      cell: ({ getValue }) => <span>{Number(getValue() ?? 0).toFixed(1)}%</span>,
    },
    {
      accessorKey: "liquidationThresholdPercent",
      header: "Liquidation Threshold",
      cell: ({ getValue }) => <span>{Number(getValue() ?? 0).toFixed(1)}%</span>,
    },
    {
      accessorKey: "status",
      header: "Status ID",
      cell: ({ getValue }) => {
        const status = getValue() as LoanStatus;
        const badge = getStatusBadge(status);
        return (
          <Badge variant={badge.variant} showStatusDot>
            {badge.label}
          </Badge>
        );
      },
    },
    createActionColumnWithOptions<LoanRow>({
      ariaLabel: "View asset loan information",
      onView: (row) => {
        setActiveLoanId(row.id);
        setStep("INFO");
        setResultMessage(null);
        setModalOpen(true);
      },
    }),
  ];

  const handleRequestApprove = (payload: {
    loanId: string;
    liquidationThresholdAmount: number;
    disbursedDateLabel: string;
    repaymentDueLabel: string;
  }) => {
    setPendingApprovePayload(payload);
    setStep("APPROVE_CONFIRM");
  };

  const handleConfirmApprove = () => {
    if (!pendingApprovePayload) return;

    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === pendingApprovePayload.loanId
          ? {
              ...loan,
              status: "active",
              liquidationThresholdAmount: pendingApprovePayload.liquidationThresholdAmount,
              disbursedDateLabel: pendingApprovePayload.disbursedDateLabel,
              repaymentDueLabel: pendingApprovePayload.repaymentDueLabel,
            }
          : loan,
      ),
    );

    setPendingApprovePayload(null);
    setStep("RESULT");
    setResultMessage({
      title: "Loan Disbursement Approved",
      description: "Beneficiary will receive allocated loan amount in their wallet once processed.",
    });
  };

  const handleConfirmReject = (reason: string) => {
    if (!activeLoanId) return;

    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === activeLoanId
          ? {
              ...loan,
              status: "rejected",
              rejectionReason: reason,
            }
          : loan,
      ),
    );

    setStep("RESULT");
    setResultMessage({
      title: "Loan Request Rejected",
      description: `Reason for Rejection: ${reason}`,
    });
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setStep("INFO");
      setResultMessage(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TableSearchField placeholder="Search Transaction ID" className="max-w-md" />

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

      <DataTable<LoanRow, unknown>
        columns={columns}
        data={rows}
        enableCheckbox
        pagination={{
          totalEntries: filtered.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeLoan && (
        <AssetLoanModal
          key={activeLoan.id}
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          loan={activeLoan}
          step={step}
          onStepChange={setStep}
          onRequestApprove={handleRequestApprove}
          onConfirmApprove={handleConfirmApprove}
          onConfirmReject={handleConfirmReject}
          resultMessage={resultMessage}
        />
      )}
    </div>
  );
}
