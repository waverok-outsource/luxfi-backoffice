"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { ASSET_LOANS_STATUS_CONFIG } from "@/module/dashboard/asset-loans/components/status-config";
import {
  AssetLoansBaseTable,
  AssetLoansTableToolbar,
  createActionColumnWithOptions,
  createCurrencyColumn,
  createIdentifierColumn,
  createPercentColumn,
  createSerialColumn,
  createStatusColumn,
  useFilteredRows,
} from "@/module/dashboard/asset-loans/components/tables/shared";
import {
  assetLoanRequestRows,
  type AssetLoanRequestRow,
} from "@/module/dashboard/asset-loans/data";

const SEARCH_FIELDS: Array<keyof AssetLoanRequestRow> = ["loanId", "borrowerId"];

export function AssetLoanRequestsTable() {
  const router = useRouter();
  const { search } = useURLTableSearch();
  const rows = useFilteredRows(assetLoanRequestRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<AssetLoanRequestRow, unknown>[]>(
    () => [
      createSerialColumn<AssetLoanRequestRow>(),
      createIdentifierColumn<AssetLoanRequestRow>("Loan ID", "loanId"),
      createIdentifierColumn<AssetLoanRequestRow>("Borrower ID", "borrowerId"),
      createCurrencyColumn<AssetLoanRequestRow>("Loan Value", "loanValue"),
      createCurrencyColumn<AssetLoanRequestRow>("Collateral Value", "collateralValue"),
      createPercentColumn<AssetLoanRequestRow>("LTV", "ltv"),
      createPercentColumn<AssetLoanRequestRow>("Liquidation Threshold", "liquidationThreshold"),
      createStatusColumn<AssetLoanRequestRow, AssetLoanRequestRow["status"]>(
        "Status ID",
        ASSET_LOANS_STATUS_CONFIG,
      ),
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
      <AssetLoansTableToolbar />
      <AssetLoansBaseTable rows={rows} columns={columns} />
    </div>
  );
}
