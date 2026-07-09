"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
} from "@/components/table";
import { ActivityLogDetailsModal } from "@/module/dashboard/asset-management/user-portfolios/components/modals/activity-log-details-modal";
import {
  mockActivityLogByPortfolioId,
  type PortfolioActivityLogEntry,
} from "@/module/dashboard/asset-management/user-portfolios/data";

type ActivityLogRow = Record<string, unknown> & {
  id: string;
  action: string;
  initiatorName: string;
  initiatorRole: string;
  actionDate: string;
  actionTimestamp: string;
};

type ActivityLogTabProps = {
  portfolioId: string;
};

export function ActivityLogTab({ portfolioId }: ActivityLogTabProps) {
  const [activeEntry, setActiveEntry] = React.useState<PortfolioActivityLogEntry | null>(null);
  const logs = mockActivityLogByPortfolioId[portfolioId] ?? [];

  const rows: ActivityLogRow[] = logs.map((log) => ({
    id: log.logId,
    action: log.action,
    initiatorName: log.initiatorName,
    initiatorRole: log.initiatorRole,
    actionDate: log.actionDateLabel,
    actionTimestamp: log.actionTimestampLabel,
  }));

  const columns: ColumnDef<ActivityLogRow, unknown>[] = [
    createSerialColumn<ActivityLogRow>(),
    createIdentifierColumn<ActivityLogRow>("Log ID", "id"),
    createTextColumn<ActivityLogRow>("Action", "action", "max-w-[220px]"),
    createTextColumn<ActivityLogRow>("Initiator Name", "initiatorName"),
    createTextColumn<ActivityLogRow>("Initiator Role", "initiatorRole"),
    createTextColumn<ActivityLogRow>("Action Date", "actionDate"),
    createTextColumn<ActivityLogRow>("Action Timestamp", "actionTimestamp"),
    createActionColumnWithOptions<ActivityLogRow>({
      ariaLabel: "View portfolio activity log",
      onView: (row) => {
        const entry = logs.find((log) => log.logId === row.id);
        if (entry) setActiveEntry(entry);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No activity logged yet."
        pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
      />

      {activeEntry ? (
        <ActivityLogDetailsModal
          open={Boolean(activeEntry)}
          onOpenChange={(open) => {
            if (!open) setActiveEntry(null);
          }}
          activity={activeEntry}
        />
      ) : null}
    </>
  );
}
