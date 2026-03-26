"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  BaseTable,
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { SmartContractModal } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-modal";
import type { SmartContractStatus } from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-types";
import type {
  LoanCaseApprovalPayload,
  LoanCaseFlowStep,
} from "@/module/dashboard/customers/customer-details/components/shared/loan-case-flow";
import { formatLoanCaseMoney } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import {
  createSmartContractRecords,
  type SmartContractDashboardRecord,
} from "@/module/dashboard/smart-contracts/data";

type SmartContractsQuery = {
  page?: string;
};

type SmartContractsTableRow = Pick<
  SmartContractDashboardRecord,
  | "id"
  | "loanId"
  | "borrowerId"
  | "principalAmount"
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
      return { variant: "success" as const, label: "Complete" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function createCurrencyColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <span>{formatLoanCaseMoney(Number(getValue() ?? 0))}</span>,
  };
}

function createPercentColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <span>{Number(getValue() ?? 0).toFixed(1)}%</span>,
  };
}

export function SmartContractsTable() {
  const { value } = useURLQuery<SmartContractsQuery>();
  const { search } = useURLTableSearch();
  const [contracts, setContracts] = React.useState<SmartContractDashboardRecord[]>(() =>
    createSmartContractRecords(),
  );
  const [activeContractId, setActiveContractId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<LoanCaseFlowStep>("INFO");
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);
  const [pendingApprovePayload, setPendingApprovePayload] =
    React.useState<LoanCaseApprovalPayload | null>(null);

  const searchQuery = search.trim().toLowerCase();
  const filteredContracts = React.useMemo(() => {
    if (!searchQuery) {
      return contracts;
    }

    return contracts.filter(
      (contract) =>
        contract.loanId.toLowerCase().includes(searchQuery) ||
        contract.borrowerId.toLowerCase().includes(searchQuery) ||
        contract.borrowerName.toLowerCase().includes(searchQuery) ||
        contract.contractAddress.toLowerCase().includes(searchQuery),
    );
  }, [contracts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredContracts.length / PAGE_SIZE));
  const parsedPage = Number(value.page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<SmartContractsTableRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredContracts.slice(start, start + PAGE_SIZE).map((contract) => ({
      id: contract.id,
      loanId: contract.loanId,
      borrowerId: contract.borrowerId,
      principalAmount: contract.principalAmount,
      collateralMarketPrice: contract.collateralMarketPrice,
      ltvPercent: contract.ltvPercent,
      liquidationThresholdPercent: contract.liquidationThresholdPercent,
      status: contract.status,
    }));
  }, [currentPage, filteredContracts]);

  const activeContract = activeContractId
    ? (contracts.find((contract) => contract.id === activeContractId) ?? null)
    : null;

  const columns = React.useMemo<ColumnDef<SmartContractsTableRow, unknown>[]>(
    () => [
      createSerialColumn<SmartContractsTableRow>(),
      createIdentifierColumn<SmartContractsTableRow>("Loan ID", "loanId"),
      createIdentifierColumn<SmartContractsTableRow>("Borrower ID", "borrowerId"),
      createCurrencyColumn<SmartContractsTableRow>("Loan Value", "principalAmount"),
      createCurrencyColumn<SmartContractsTableRow>("Collateral Value", "collateralMarketPrice"),
      createPercentColumn<SmartContractsTableRow>("LTV", "ltvPercent"),
      createPercentColumn<SmartContractsTableRow>(
        "Liquidation Threshold",
        "liquidationThresholdPercent",
      ),
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
      createActionColumnWithOptions<SmartContractsTableRow>({
        ariaLabel: "View smart contract information",
        onView: (row) => {
          setActiveContractId(row.id);
          setStep("INFO");
          setResultMessage(null);
          setModalOpen(true);
        },
      }),
    ],
    [],
  );

  const handleRequestApprove = React.useCallback((payload: LoanCaseApprovalPayload) => {
    setPendingApprovePayload(payload);
    setStep("APPROVE_CONFIRM");
  }, []);

  const handleConfirmApprove = React.useCallback(() => {
    if (!pendingApprovePayload) {
      return;
    }

    setContracts((previousContracts) =>
      previousContracts.map((contract) =>
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
  }, [pendingApprovePayload]);

  const handleConfirmReject = React.useCallback(
    (reason: string) => {
      if (!activeContractId) {
        return;
      }

      setContracts((previousContracts) =>
        previousContracts.map((contract) =>
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
        title: "Loan Application Rejected",
        description:
          "The smart contract request has been rejected and the borrower has been notified.",
      });
    },
    [activeContractId],
  );

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search Customer name or ID" />
        <BaseTable<SmartContractsTableRow>
          data={rows}
          columns={columns}
          pageSize={PAGE_SIZE}
          totalEntries={filteredContracts.length}
        />
      </div>

      <SmartContractModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setPendingApprovePayload(null);
            setStep("INFO");
          }
        }}
        contract={activeContract}
        step={step}
        onStepChange={setStep}
        onRequestApprove={handleRequestApprove}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
        resultMessage={resultMessage}
      />
    </>
  );
}
