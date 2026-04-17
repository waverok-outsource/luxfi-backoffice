"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { LoanDisbursementDetailsModal } from "@/module/dashboard/asset-loans/components/modals/loan-disbursement-details-modal";
import { ASSET_LOANS_STATUS_CONFIG } from "@/module/dashboard/asset-loans/components/status-config";
import {
  AssetLoansBaseTable,
  AssetLoansTableToolbar,
  createActionColumnWithOptions,
  createCurrencyColumn,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
  useFilteredRows,
} from "@/module/dashboard/asset-loans/components/tables/shared";
import {
  loanDisbursementRows,
  type LoanDisbursementRow,
} from "@/module/dashboard/asset-loans/data";

const SEARCH_FIELDS: Array<keyof LoanDisbursementRow> = ["loanId", "borrowerId", "borrowerName"];

export function LoanDisbursementsTable() {
  const { value } = useURLQuery<{ q?: string }>();
  const search = value.q ?? "";
  const [selectedDisbursement, setSelectedDisbursement] =
    React.useState<LoanDisbursementRow | null>(null);
  const rows = useFilteredRows(loanDisbursementRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<LoanDisbursementRow, unknown>[]>(
    () => [
      createSerialColumn<LoanDisbursementRow>(),
      createIdentifierColumn<LoanDisbursementRow>("Loan ID", "loanId"),
      createIdentifierColumn<LoanDisbursementRow>("Borrower ID", "borrowerId"),
      createCurrencyColumn<LoanDisbursementRow>("Loan Value", "loanValue"),
      createCurrencyColumn<LoanDisbursementRow>("Disbursed Value", "disbursedValue"),
      createTextColumn<LoanDisbursementRow>("Disbursement Date", "disbursementDate"),
      createStatusColumn<LoanDisbursementRow, LoanDisbursementRow["status"]>(
        "Status ID",
        ASSET_LOANS_STATUS_CONFIG,
      ),
      createActionColumnWithOptions<LoanDisbursementRow>({
        ariaLabel: "View loan disbursement",
        onView: (row) => setSelectedDisbursement(row),
      }),
    ],
    [],
  );

  return (
    <>
      <div className="space-y-4">
        <AssetLoansTableToolbar placeholder="Search Customer name or ID" />
        <AssetLoansBaseTable rows={rows} columns={columns} />
      </div>

      {selectedDisbursement ? (
        <LoanDisbursementDetailsModal
          open={Boolean(selectedDisbursement)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedDisbursement(null);
            }
          }}
          disbursement={selectedDisbursement}
        />
      ) : null}
    </>
  );
}
