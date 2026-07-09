"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { ActivityLogDetailsModal } from "@/components/modal";
import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { mockMarketplaceAuditLogs } from "@/module/dashboard/marketplace/data";
import type { MarketplaceAuditLogEntry } from "@/types/marketplace.type";

type AuditLogRow = Record<string, unknown> & {
  id: string;
  initiatorName: string;
  initiatorRole: string;
  action: string;
  assetId: string;
  actionTimestamp: string;
  actionDate: string;
};

const PAGE_SIZE = 10;

function matchesQuery(log: MarketplaceAuditLogEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return (
    !normalizedQuery ||
    log.logId.toLowerCase().includes(normalizedQuery) ||
    log.assetId.toLowerCase().includes(normalizedQuery) ||
    log.initiatorName.toLowerCase().includes(normalizedQuery)
  );
}

export function AuditLogTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeLog, setActiveLog] = React.useState<MarketplaceAuditLogEntry | null>(null);

  const filtered = React.useMemo(
    () => mockMarketplaceAuditLogs.filter((log) => matchesQuery(log, value.q ?? "")),
    [value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: AuditLogRow[] = React.useMemo(() => {
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

  const columns: ColumnDef<AuditLogRow, unknown>[] = [
    createIdentifierColumn<AuditLogRow>("Log ID", "id"),
    createTextColumn<AuditLogRow>("User", "initiatorName"),
    createTextColumn<AuditLogRow>("Role", "initiatorRole"),
    createTextColumn<AuditLogRow>("Action", "action"),
    createIdentifierColumn<AuditLogRow>("Asset ID", "assetId"),
    createTextColumn<AuditLogRow>("Action Timestamp", "actionTimestamp"),
    createTextColumn<AuditLogRow>("Action Date", "actionDate"),
    createActionColumnWithOptions<AuditLogRow>({
      ariaLabel: "View marketplace activity log",
      onView: (row) => {
        const log = mockMarketplaceAuditLogs.find((candidate) => candidate.logId === row.id);
        if (log) setActiveLog(log);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No marketplace activity found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeLog ? (
        <ActivityLogDetailsModal
          open={Boolean(activeLog)}
          onOpenChange={(open) => {
            if (!open) setActiveLog(null);
          }}
          title="Marketplace Activity Details"
          description="View and manage marketplace activity log"
          rowGroups={[
            [{ label: "Log ID:", value: activeLog.logId, copyText: activeLog.logId }],
            [
              { label: "Action:", value: activeLog.action },
              { label: "Action Date:", value: activeLog.actionDateLabel },
              { label: "Timestamp:", value: activeLog.actionTimestampLabel },
            ],
            [
              { label: "Initiator ID:", value: activeLog.initiatorId, copyText: activeLog.initiatorId },
              { label: "Initiator Name:", value: activeLog.initiatorName },
              { label: "Initiator Role:", value: activeLog.initiatorRole },
            ],
          ]}
        />
      ) : null}
    </>
  );
}
