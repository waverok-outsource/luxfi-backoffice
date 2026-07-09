"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { VerificationLogDetailsModal } from "@/module/dashboard/asset-management/components/modals/verification-log-details-modal";
import { mockAssetVerificationLogs } from "@/module/dashboard/asset-management/data";
import type { AssetVerificationLogEntry } from "@/types/asset-management.type";

type VerificationLogRow = Record<string, unknown> & {
  id: string;
  initiatorName: string;
  initiatorRole: string;
  action: string;
  assetId: string;
  actionTimestamp: string;
  actionDate: string;
};

const PAGE_SIZE = 10;

function matchesQuery(log: AssetVerificationLogEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return (
    !normalizedQuery ||
    log.logId.toLowerCase().includes(normalizedQuery) ||
    log.assetId.toLowerCase().includes(normalizedQuery) ||
    log.initiatorName.toLowerCase().includes(normalizedQuery)
  );
}

export function VerificationLogsTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeLog, setActiveLog] = React.useState<AssetVerificationLogEntry | null>(null);

  const filtered = React.useMemo(
    () => mockAssetVerificationLogs.filter((log) => matchesQuery(log, value.q ?? "")),
    [value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: VerificationLogRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((log) => ({
      id: log.logId,
      initiatorName: log.initiatorName,
      initiatorRole: log.initiatorRole,
      action: log.action,
      assetId: log.assetId,
      actionTimestamp: log.actionTimestampLabel,
      actionDate: log.actionDateLabel,
    }));
  }, [currentPage, filtered]);

  const columns: ColumnDef<VerificationLogRow, unknown>[] = [
    createIdentifierColumn<VerificationLogRow>("Log ID", "id"),
    createTextColumn<VerificationLogRow>("User", "initiatorName"),
    createTextColumn<VerificationLogRow>("Role", "initiatorRole"),
    createTextColumn<VerificationLogRow>("Action", "action"),
    createIdentifierColumn<VerificationLogRow>("Asset ID", "assetId"),
    createTextColumn<VerificationLogRow>("Action Timestamp", "actionTimestamp"),
    createTextColumn<VerificationLogRow>("Action Date", "actionDate"),
    createActionColumnWithOptions<VerificationLogRow>({
      ariaLabel: "View verification log",
      onView: (row) => {
        const log = mockAssetVerificationLogs.find((candidate) => candidate.logId === row.id);
        if (log) setActiveLog(log);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No verification logs found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeLog ? (
        <VerificationLogDetailsModal
          open={Boolean(activeLog)}
          onOpenChange={(open) => {
            if (!open) setActiveLog(null);
          }}
          log={activeLog}
        />
      ) : null}
    </>
  );
}
