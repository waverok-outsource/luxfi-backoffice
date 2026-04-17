"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { LoanActivityDetailsModal } from "@/module/dashboard/asset-loans/components/modals/loan-activity-details-modal";
import {
  AssetLoansBaseTable,
  AssetLoansTableToolbar,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
  useFilteredRows,
} from "@/module/dashboard/asset-loans/components/tables/shared";
import {
  loanActivityLogRows,
  type LoanActivityLogRow,
} from "@/module/dashboard/asset-loans/data";

const SEARCH_FIELDS: Array<keyof LoanActivityLogRow> = ["logId", "initiatorName", "initiatorId"];

export function LoanActivityLogsTable() {
  const { value } = useURLQuery<{ q?: string }>();
  const search = value.q ?? "";
  const [selectedActivity, setSelectedActivity] = React.useState<LoanActivityLogRow | null>(null);
  const rows = useFilteredRows(loanActivityLogRows, search, SEARCH_FIELDS);

  const columns = React.useMemo<ColumnDef<LoanActivityLogRow, unknown>[]>(
    () => [
      createSerialColumn<LoanActivityLogRow>(),
      createIdentifierColumn<LoanActivityLogRow>("Log ID", "logId"),
      createTextColumn<LoanActivityLogRow>("Action", "activity", "max-w-[220px]"),
      createTextColumn<LoanActivityLogRow>("Initiator Name", "initiatorName"),
      createTextColumn<LoanActivityLogRow>("Initiator Role", "initiatorRole"),
      createTextColumn<LoanActivityLogRow>("Action Date", "actionDate"),
      createTextColumn<LoanActivityLogRow>("Action Timestamp", "actionTimestamp"),
      createActionColumnWithOptions<LoanActivityLogRow>({
        ariaLabel: "View loan activity log",
        onView: (row) => setSelectedActivity(row),
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

      {selectedActivity ? (
        <LoanActivityDetailsModal
          open={Boolean(selectedActivity)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedActivity(null);
            }
          }}
          activity={selectedActivity}
        />
      ) : null}
    </>
  );
}
