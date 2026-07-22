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
import { ActivityLogDetailsModal } from "@/components/modal";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useAuditLogs } from "@/services/queries/audit.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

type AuditLogRow = {
  id: string;
  logId: string;
  action: string;
  initiatorName: string;
  initiatorRole: string;
  actionDate: string;
  actionTimestamp: string;
};

const PAGE_SIZE = 5;

export function AuditLogTable() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeLogId, setActiveLogId] = React.useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: auditResponse, isLoading } = useAuditLogs("customer", listQuery);
  const logs = auditResponse?.data ?? [];
  const paginationMeta = auditResponse?.pagination;

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: paginationMeta,
  });

  const rows: AuditLogRow[] = logs.map((log) => ({
    id: log.logId,
    logId: log.logId,
    action: log.event,
    initiatorName: log.initiatorName,
    initiatorRole: log.maker,
    actionDate: formatDate(log.createdAt, "dd/MM/yyyy"),
    actionTimestamp: formatDate(log.createdAt, "h:mm a"),
  }));

  const activeLog =
    activeLogId != null ? (logs.find((log) => log.logId === activeLogId) ?? null) : null;

  const columns: ColumnDef<AuditLogRow, unknown>[] = [
    createSerialColumn<AuditLogRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<AuditLogRow>("Log ID", "logId"),
    createTextColumn<AuditLogRow>("Action", "action", "max-w-[160px]"),
    createTextColumn<AuditLogRow>("Initiator Name", "initiatorName"),
    createTextColumn<AuditLogRow>("Initiator Role", "initiatorRole", "max-w-[180px]"),
    createTextColumn<AuditLogRow>("Action Date", "actionDate"),
    createTextColumn<AuditLogRow>("Action Timestamp", "actionTimestamp"),
    createActionColumnWithOptions<AuditLogRow>({
      header: "",
      ariaLabel: "View activity log details",
      onView: (row) => {
        setActiveLogId(row.logId);
      },
    }),
  ];

  return (
    <>
      <DataTable<AuditLogRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No audit logs found."
        pagination={{
          totalEntries: paginationMeta?.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeLog ? (
        <ActivityLogDetailsModal
          open={Boolean(activeLog)}
          onOpenChange={(open) => {
            if (!open) setActiveLogId(null);
          }}
          title="Activity Details"
          description="View and manage Activity Log entry"
          rowGroups={[
            [{ label: "Log ID:", value: activeLog.logId, copyText: activeLog.logId }],
            [
              { label: "Action:", value: activeLog.event },
              { label: "Message:", value: activeLog.message },
              { label: "Status:", value: activeLog.status },
              { label: "Action Date:", value: formatDate(activeLog.createdAt, "do MMMM, yyyy") },
              { label: "Timestamp:", value: formatDate(activeLog.createdAt, "h:mm a") },
            ],
            [
              { label: "Initiator Name:", value: activeLog.initiatorName },
              { label: "Initiator Role:", value: activeLog.maker },
              { label: "Initiator ID:", value: activeLog.userId, copyText: activeLog.userId },
            ],
          ]}
        />
      ) : null}
    </>
  );
}
