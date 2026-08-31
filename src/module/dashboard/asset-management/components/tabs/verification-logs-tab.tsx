"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { VerificationLogDetailsModal } from "@/module/dashboard/asset-management/components/modals/verification-log-details-modal";
import { useVerificationLogs } from "@/services/queries/asset-management.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";

type VerificationLogRow = Record<string, unknown> & {
  id: string;
  user: string;
  role: string;
  action: string;
  assetId: string;
  actionTimestamp: string;
  actionDate: string;
};

const PAGE_SIZE = 10;

export function VerificationLogsTab() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeLogId, setActiveLogId] = React.useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...((value.q ?? "").trim() ? { q: value.q!.trim() } : {}),
  });

  const { data: response, isLoading } = useVerificationLogs(query);
  const logs = response?.data ?? [];

  const rows: VerificationLogRow[] = logs.map((log) => ({
    id: log.logId,
    user: log.user,
    role: log.role,
    action: log.action,
    assetId: log.assetId,
    actionTimestamp: log.actionTimestamp,
    actionDate: log.actionDate,
  }));

  const columns: ColumnDef<VerificationLogRow, unknown>[] = [
    createIdentifierColumn<VerificationLogRow>("Log ID", "id"),
    createTextColumn<VerificationLogRow>("User", "user"),
    createTextColumn<VerificationLogRow>("Role", "role"),
    createTextColumn<VerificationLogRow>("Action", "action"),
    createIdentifierColumn<VerificationLogRow>("Asset ID", "assetId"),
    createTextColumn<VerificationLogRow>("Action Timestamp", "actionTimestamp"),
    createTextColumn<VerificationLogRow>("Action Date", "actionDate"),
    createActionColumnWithOptions<VerificationLogRow>({
      ariaLabel: "View verification log",
      onView: (row) => setActiveLogId(row.id),
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No verification logs found."
        pagination={{ totalEntries: response?.pagination.total ?? 0, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeLogId ? (
        <VerificationLogDetailsModal
          open={Boolean(activeLogId)}
          onOpenChange={(open) => {
            if (!open) setActiveLogId(null);
          }}
          logId={activeLogId}
        />
      ) : null}
    </>
  );
}
