"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { LoanRepaymentDetailsModal } from "@/module/dashboard/asset-loans/components/modals/loan-repayment-details-modal";
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
import { loanRepaymentRows, type LoanRepaymentRow } from "@/module/dashboard/asset-loans/data";

const SEARCH_FIELDS: Array<keyof LoanRepaymentRow> = ["loanId", "borrowerId", "borrowerName"];

export function LoanRepaymentsTable() {
  const { search } = useURLTableSearch();
  const [selectedRepayment, setSelectedRepayment] = React.useState<LoanRepaymentRow | null>(null);
  const rows = useFilteredRows(loanRepaymentRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<LoanRepaymentRow, unknown>[]>(
    () => [
      createSerialColumn<LoanRepaymentRow>(),
      createIdentifierColumn<LoanRepaymentRow>("Loan ID", "loanId"),
      createIdentifierColumn<LoanRepaymentRow>("Borrower ID", "borrowerId"),
      createCurrencyColumn<LoanRepaymentRow>("Loan Value", "loanValue"),
      createCurrencyColumn<LoanRepaymentRow>("Repaid Value", "repaidValue"),
      createTextColumn<LoanRepaymentRow>("Repayment Date", "repaymentDate"),
      createStatusColumn<LoanRepaymentRow, LoanRepaymentRow["status"]>(
        "Status ID",
        ASSET_LOANS_STATUS_CONFIG,
      ),
      createActionColumnWithOptions<LoanRepaymentRow>({
        ariaLabel: "View loan repayment",
        onView: (row) => setSelectedRepayment(row),
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

      {selectedRepayment ? (
        <LoanRepaymentDetailsModal
          open={Boolean(selectedRepayment)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRepayment(null);
            }
          }}
          repayment={selectedRepayment}
        />
      ) : null}
    </>
  );
}
