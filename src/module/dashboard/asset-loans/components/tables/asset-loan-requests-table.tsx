"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { DataTable, TableSearchToolbar, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ASSET_LOANS_STATUS_CONFIG } from "@/module/dashboard/asset-loans/components/status-config";
import { useLoans } from "@/services/queries/loan.queries";
import type { LoanStatus, LoanType } from "@/types/loan.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatCurrency } from "@/util/format-currency";

function formatLiquidationThreshold(lt: LoanType["liquidationThreshold"]): string {
  if (typeof lt === "object" && lt !== null) {
    return formatCurrency(lt.value, lt.currencyCode);
  }
  if (typeof lt === "number" && lt > 0) {
    return formatCurrency(lt);
  }
  return "-";
}

type AssetLoanRequestRow = Record<string, unknown> & {
  id: string;
  loanId: string;
  borrowerName: string;
  borrowerId: string;
  loanValue: string;
  collateralValue: string;
  ltv: string;
  liquidationThreshold: string;
  status: LoanStatus;
};

const PAGE_SIZE = 10;

export function AssetLoanRequestsTable() {
  const router = useRouter();
  const { value } = useURLQuery<{ page?: string; q?: string }>();

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();

  const loansQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useLoans(loansQuery);
  const loans = response?.data ?? [];

  const rows: AssetLoanRequestRow[] = loans.map((loan) => ({
    id: loan.loanRef,
    loanId: loan.loanId,
    borrowerName: loan.borrower.name,
    borrowerId: loan.borrower.id,
    loanValue: formatCurrency(loan.loanValue.value, loan.loanValue.currencyCode),
    collateralValue: formatCurrency(loan.collateralValue.value, loan.collateralValue.currencyCode),
    ltv: `${loan.ltv.toFixed(1)}%`,
    liquidationThreshold: formatLiquidationThreshold(loan.liquidationThreshold),
    status: loan.status,
  }));

  const columns = React.useMemo<ColumnDef<AssetLoanRequestRow, unknown>[]>(
    () => [
      createIdentifierColumn<AssetLoanRequestRow>("Loan ID", "loanId"),
      createTextColumn<AssetLoanRequestRow>("Borrower Name", "borrowerName", "max-w-[160px]"),
      createIdentifierColumn<AssetLoanRequestRow>("Borrower ID", "borrowerId"),
      createTextColumn<AssetLoanRequestRow>("Loan Value", "loanValue"),
      createTextColumn<AssetLoanRequestRow>("Collateral Value", "collateralValue"),
      createTextColumn<AssetLoanRequestRow>("LTV", "ltv"),
      createTextColumn<AssetLoanRequestRow>("Liquidation Threshold", "liquidationThreshold"),
      createStatusColumn<AssetLoanRequestRow, LoanStatus>("Status ID", ASSET_LOANS_STATUS_CONFIG),
      createActionColumnWithOptions<AssetLoanRequestRow>({
        ariaLabel: "View asset loan request",
        onView: (row) => {
          router.push(`/asset-loans/${encodeURIComponent(row.id)}`);
        },
      }),
    ],
    [router],
  );

  return (
    <div className="space-y-4">
      <TableSearchToolbar placeholder="Search Loan ID or Borrower ID" />

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No asset loan requests found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />
    </div>
  );
}
