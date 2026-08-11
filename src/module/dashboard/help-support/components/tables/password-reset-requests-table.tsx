"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
  HelpSupportBaseTable,
  HelpSupportTableToolbar,
} from "@/module/dashboard/help-support/components/tables/shared";
import {
  PASSWORD_RESET_STATUS_CONFIG,
} from "@/module/dashboard/help-support/components/status-config";
import { PasswordResetRequestDetailsModal } from "@/module/dashboard/help-support/components/modals/password-reset-request-details-modal";
import { usePasswordResetRequests } from "@/services/queries/support.queries";
import useSupportFns from "@/services/functions/support.fns";
import type { PasswordResetRequestType } from "@/types/support.type";
import { createStatusColumn as createStatusColumnBase } from "@/components/table";
import { Button } from "@/components/ui/button";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, toTitleCase } from "@/util/helper";

const PAGE_SIZE = 5;

type TableRow = {
  id: string;
  logId: string;
  initiatorName: string;
  initiatorEmail: string;
  assignedRole: string;
  requestTimestampLabel: string;
  status: PasswordResetRequestType["status"];
};

function createPasswordResetStatusColumn(
  header: string,
): ColumnDef<TableRow, unknown> {
  return createStatusColumnBase<TableRow, PasswordResetRequestType["status"]>(
    header,
    PASSWORD_RESET_STATUS_CONFIG,
  );
}

function createActionColumnWithReset(options: {
  onView: (row: TableRow) => void;
  onReset: (row: TableRow) => void;
}): ColumnDef<TableRow, unknown> {
  return {
    id: "rowActions",
    header: "Action",
    cell: ({ row }) => {
      const request = row.original;
      const isReset = request.status === "reset";

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            aria-label="View password reset request details"
            variant="table-action"
            size="table-action"
            onClick={() => options.onView(request)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-8 rounded-xl px-4 text-sm font-semibold"
            disabled={isReset}
            onClick={() => options.onReset(request)}
          >
            {isReset ? "Reset" : "Reset"}
          </Button>
        </div>
      );
    },
  };
}

export function PasswordResetRequestsTable() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = usePasswordResetRequests(query);
  const requests = React.useMemo(() => response?.data ?? [], [response?.data]);

  const [selectedRequestRef, setSelectedRequestRef] = React.useState<string | null>(null);

  const selectedRequest = selectedRequestRef
    ? (requests.find((r) => r.requestRef === selectedRequestRef) ?? null)
    : null;

  const { resetPasswordRequest } = useSupportFns();

  const rows: TableRow[] = React.useMemo(
    () =>
      requests.map((request) => ({
        id: request.requestRef,
        logId: request.logId,
        initiatorName: request.initiatorName,
        initiatorEmail: request.initiatorEmail,
        assignedRole: toTitleCase(request.assignedRole),
        requestTimestampLabel: formatDate(request.requestDate, "dd - MM - yyyy"),
        status: request.status,
      })),
    [requests],
  );

  const columns = React.useMemo<ColumnDef<TableRow, unknown>[]>(
    () => [
      createSerialColumn<TableRow>(),
      createIdentifierColumn<TableRow>("Log ID", "logId"),
      createTextColumn<TableRow>("Initiator Name", "initiatorName"),
      createTextColumn<TableRow>("Initiator Email Address", "initiatorEmail"),
      createTextColumn<TableRow>("Assigned Role", "assignedRole"),
      createTextColumn<TableRow>("Request Timestamp", "requestTimestampLabel"),
      createPasswordResetStatusColumn("Status"),
      createActionColumnWithReset({
        onView: (row) => setSelectedRequestRef(row.id),
        onReset: (row) => resetPasswordRequest(row.id, undefined),
      }),
    ],
    [resetPasswordRequest],
  );

  return (
    <>
      <div className="space-y-4">
        <HelpSupportTableToolbar />
        <HelpSupportBaseTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          totalEntries={response?.pagination.total ?? 0}
        />
      </div>

      {selectedRequest ? (
        <PasswordResetRequestDetailsModal
          key={selectedRequest.requestRef}
          open={Boolean(selectedRequest)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRequestRef(null);
            }
          }}
          request={selectedRequest}
          onReset={(requestRef) => {
            resetPasswordRequest(requestRef, () => setSelectedRequestRef(null));
          }}
        />
      ) : null}
    </>
  );
}
