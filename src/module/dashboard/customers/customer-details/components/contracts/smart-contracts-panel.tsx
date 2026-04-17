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
import { SmartContractModal } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-modal";
import type { SmartContractRecord, SmartContractStatus } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-types";
import type {
  LoanCaseApprovalPayload,
  LoanCaseFlowStep,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-flow";
import { formatLoanCaseMoney } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";

type SmartContractRow = Pick<
  SmartContractRecord,
  | "id"
  | "loanId"
  | "principalAmount"
  | "collateralSymbol"
  | "collateralMarketPrice"
  | "ltvPercent"
  | "liquidationThresholdPercent"
  | "status"
>;

const PAGE_SIZE = 5;

function getTableStatusBadge(status: SmartContractStatus) {
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

function generateContracts(total: number): SmartContractRecord[] {
  const statuses: SmartContractStatus[] = ["pending", "active", "liquidated", "rejected", "completed"];
  const collateralSymbols = ["BTC", "ETH", "BTC", "USDT", "BTC"] as const;

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const status = statuses[index % statuses.length];
    const collateralSymbol = collateralSymbols[index % collateralSymbols.length] ?? "BTC";
    const principalAmount = [6000, 100000, 24000, 2000, 10000][index % 5] ?? 6000;
    const collateralMarketPrice = [10000, 150000, 32000, 7000, 50000][index % 5] ?? 10000;
    const ltvPercent = [57.7, 60.9, 78.2, 82.9, 55.0][index % 5] ?? 60;
    const repaymentAmount = principalAmount + principalAmount * 0.2;
    const liquidationThresholdAmount = repaymentAmount;
    const currentCollateralValue =
      status === "liquidated"
        ? liquidationThresholdAmount
        : status === "active" && serial % 2 === 0
          ? liquidationThresholdAmount - 1000
          : collateralMarketPrice;

    return {
      id: `contract-${serial}`,
      loanId: `CU-${String(8890955422 + serial)}...`,
      borrowerName: "Darryl Simmons",
      borrowerRiskCreditScorePercent: 75,
      principalAmount,
      durationLabel: "3 Weeks ( 21 Days)",
      proposedInterestLabel: "$ 19,908.00 (10%)",
      repaymentAmount,
      disbursedDateLabel:
        status === "active" || status === "liquidated" || status === "completed"
          ? "10th January, 2026"
          : "-",
      repaymentDueLabel:
        status === "active" || status === "liquidated" || status === "completed"
          ? "5th February, 2026"
          : "-",
      collateralSymbol,
      collateralName:
        collateralSymbol === "BTC" ? "Bitcoin" : collateralSymbol === "ETH" ? "Ethereum" : "Tether",
      collateralMarketPrice,
      collateralTrendLabel: "99.9% ▲ Last 7 days",
      contractAddress: `0ex762*****${637999292287 + serial}`,
      contractVerified: true,
      lockedCollateralValue: principalAmount,
      lockedCollateralQuantityLabel:
        collateralSymbol === "BTC"
          ? "1.057 BTC"
          : collateralSymbol === "ETH"
            ? "4.822 ETH"
            : "10,000 USDT",
      ltvPercent,
      liquidationThresholdPercent: ltvPercent,
      liquidationThresholdAmount,
      currentCollateralValue,
      status,
      rejectionReason: status === "rejected" ? "Asset Collateral Low" : undefined,
    };
  });
}

export function SmartContractsPanel() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [contracts, setContracts] = React.useState<SmartContractRecord[]>(() => generateContracts(1000));
  const [activeContractId, setActiveContractId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<LoanCaseFlowStep>("INFO");
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);
  const [pendingApprovePayload, setPendingApprovePayload] = React.useState<LoanCaseApprovalPayload | null>(null);

  const searchQuery = (value.q ?? "").trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!searchQuery) return contracts;
    return contracts.filter(
      (contract) =>
        contract.loanId.toLowerCase().includes(searchQuery) ||
        contract.contractAddress.toLowerCase().includes(searchQuery),
    );
  }, [contracts, searchQuery]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<SmartContractRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((contract) => ({
      id: contract.id,
      loanId: contract.loanId,
      principalAmount: contract.principalAmount,
      collateralSymbol: contract.collateralSymbol,
      collateralMarketPrice: contract.collateralMarketPrice,
      ltvPercent: contract.ltvPercent,
      liquidationThresholdPercent: contract.liquidationThresholdPercent,
      status: contract.status,
    }));
  }, [currentPage, filtered]);

  const activeContract = activeContractId
    ? contracts.find((contract) => contract.id === activeContractId) ?? null
    : null;

  const columns: ColumnDef<SmartContractRow, unknown>[] = [
    createSerialColumn<SmartContractRow>(),
    createIdentifierColumn<SmartContractRow>("Loan ID", "loanId"),
    {
      accessorKey: "principalAmount",
      header: "Loan Value",
      cell: ({ getValue }) => <span>{formatLoanCaseMoney(Number(getValue() ?? 0))}</span>,
    },
    {
      accessorKey: "collateralSymbol",
      header: "Collateral",
      cell: ({ getValue }) => <span>{String(getValue() ?? "-")}</span>,
    },
    {
      accessorKey: "collateralMarketPrice",
      header: "Collateral Value",
      cell: ({ getValue }) => <span>{formatLoanCaseMoney(Number(getValue() ?? 0))}</span>,
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
        const badge = getTableStatusBadge(getValue() as SmartContractStatus);
        return (
          <Badge variant={badge.variant} showStatusDot>
            {badge.label}
          </Badge>
        );
      },
    },
    createActionColumnWithOptions<SmartContractRow>({
      ariaLabel: "View smart contract information",
      onView: (row) => {
        setActiveContractId(row.id);
        setStep("INFO");
        setResultMessage(null);
        setModalOpen(true);
      },
    }),
  ];

  const handleRequestApprove = (payload: LoanCaseApprovalPayload) => {
    setPendingApprovePayload(payload);
    setStep("APPROVE_CONFIRM");
  };

  const handleConfirmApprove = () => {
    if (!pendingApprovePayload) return;

    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === pendingApprovePayload.loanId
          ? {
              ...contract,
              status: "active",
              liquidationThresholdAmount: pendingApprovePayload.liquidationThresholdAmount,
              disbursedDateLabel: pendingApprovePayload.disbursedDateLabel,
              repaymentDueLabel: pendingApprovePayload.repaymentDueLabel,
            }
          : contract,
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
    if (!activeContractId) return;

    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === activeContractId
          ? {
              ...contract,
              status: "rejected",
              rejectionReason: reason,
            }
          : contract,
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
        <TableSearchField placeholder="Search Loan ID or Contract Address" className="max-w-md" />

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

      <DataTable<SmartContractRow, unknown>
        columns={columns}
        data={rows}
        enableCheckbox
        pagination={{
          totalEntries: filtered.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeContract ? (
        <SmartContractModal
          key={activeContract.id}
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          contract={activeContract}
          step={step}
          onStepChange={setStep}
          onRequestApprove={handleRequestApprove}
          onConfirmApprove={handleConfirmApprove}
          onConfirmReject={handleConfirmReject}
          resultMessage={resultMessage}
        />
      ) : null}
    </div>
  );
}
