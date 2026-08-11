"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  TableSearchToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetLoanModal } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal";
import type { AssetLoanStep } from "@/module/dashboard/customers/customer-details/components/loans/asset-loan-modal-types";
import { useCustomerLoans, useLoanRejectionReasons } from "@/services/queries/loan.queries";
import useLoanFns from "@/services/functions/loan.fns";
import type { LoanStatus, LoanType } from "@/types/loan.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";

const PAGE_SIZE = 5;

type TableRow = {
  id: string;
  loanId: string;
  loanValue: string;
  collateral: string;
  collateralValue: string;
  ltv: string;
  liquidationThreshold: string;
  status: LoanStatus;
};

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

function formatLiquidationThreshold(lt: LoanType["liquidationThreshold"]): string {
  if (typeof lt === "object" && lt !== null) {
    return formatCurrency(lt.value, lt.currencyCode);
  }
  if (typeof lt === "number" && lt > 0) {
    return formatCurrency(lt);
  }
  return "-";
}

export function AssetLoansPanel({ customerId }: { customerId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useCustomerLoans(customerId, query);
  const loans = React.useMemo(() => response?.data ?? [], [response?.data]);

  const { data: rejectionReasonsData } = useLoanRejectionReasons();
  const rejectionReasons = React.useMemo(
    () => rejectionReasonsData?.data ?? [],
    [rejectionReasonsData?.data],
  );

  const [activeLoanRef, setActiveLoanRef] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [step, setStep] = React.useState<AssetLoanStep>("INFO");
  const [resultMessage, setResultMessage] = React.useState<{
    title: string;
    description: string;
  } | null>(null);

  const activeLoan = React.useMemo(
    () => (activeLoanRef ? (loans.find((l) => l.loanRef === activeLoanRef) ?? null) : null),
    [activeLoanRef, loans],
  );

  const { approveLoan, rejectLoan } = useLoanFns();

  const rows: TableRow[] = React.useMemo(
    () =>
      loans.map((loan) => ({
        id: loan.loanRef,
        loanId: loan.loanId,
        loanValue: formatCurrency(loan.loanValue.value, loan.loanValue.currencyCode),
        collateral: loan.collateral.assetName,
        collateralValue: formatCurrency(
          loan.collateralValue.value,
          loan.collateralValue.currencyCode,
        ),
        ltv: `${loan.ltv.toFixed(1)}%`,
        liquidationThreshold: formatLiquidationThreshold(loan.liquidationThreshold),
        status: loan.status,
      })),
    [loans],
  );

  const columns = React.useMemo<ColumnDef<TableRow, unknown>[]>(
    () => [
      createSerialColumn<TableRow>(),
      createIdentifierColumn<TableRow>("Loan ID", "loanId"),
      {
        accessorKey: "loanValue",
        header: "Loan Value",
      },
      {
        accessorKey: "collateral",
        header: "Collateral",
        cell: ({ getValue }) => <span className="truncate">{String(getValue() ?? "-")}</span>,
      },
      {
        accessorKey: "collateralValue",
        header: "Collateral Value",
      },
      {
        accessorKey: "ltv",
        header: "LTV",
      },
      {
        accessorKey: "liquidationThreshold",
        header: "Liquidation Threshold",
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
      createActionColumnWithOptions<TableRow>({
        ariaLabel: "View asset loan information",
        onView: (row) => {
          setActiveLoanRef(row.id);
          setStep("INFO");
          setResultMessage(null);
          setModalOpen(true);
        },
      }),
    ],
    [],
  );

  const handleRequestApprove = (payload: {
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
  }) => {
    setStep("APPROVE_CONFIRM");
    // Store the payload for confirm step — use a ref to avoid stale closure
    setPendingApprovePayload(payload);
  };

  const [pendingApprovePayload, setPendingApprovePayload] = React.useState<{
    loanRef: string;
    liquidationThreshold: { value: number; currencyCode: string };
    dateDisburse: string;
  } | null>(null);

  const handleConfirmApprove = () => {
    if (!pendingApprovePayload) return;

    approveLoan(pendingApprovePayload.loanRef, {
      liquidationThreshold: pendingApprovePayload.liquidationThreshold,
      dateDisburse: pendingApprovePayload.dateDisburse,
    }, () => {
      setPendingApprovePayload(null);
      setStep("RESULT");
      setResultMessage({
        title: "Loan Disbursement Approved",
        description:
          "Beneficiary will receive allocated loan amount in their wallet once processed.",
      });
    });
  };

  const handleConfirmReject = (reason: string) => {
    if (!activeLoanRef) return;

    rejectLoan(activeLoanRef, { rejectionReason: reason }, () => {
      setStep("RESULT");
      setResultMessage({
        title: "Loan Request Rejected",
        description: `Reason for Rejection: ${reason}`,
      });
    });
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
      <TableSearchToolbar placeholder="Search Transaction ID" />

      <DataTable<TableRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        enableCheckbox
        pagination={{
          totalEntries: response?.pagination.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeLoan && (
        <AssetLoanModal
          key={activeLoan.loanRef}
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          loan={activeLoan}
          step={step}
          onStepChange={setStep}
          onRequestApprove={handleRequestApprove}
          onConfirmApprove={handleConfirmApprove}
          onConfirmReject={handleConfirmReject}
          resultMessage={resultMessage}
          rejectionReasons={rejectionReasons}
        />
      )}
    </div>
  );
}
