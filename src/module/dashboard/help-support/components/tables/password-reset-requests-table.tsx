"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import {
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
  HelpSupportBaseTable,
  HelpSupportTableToolbar,
  useFilteredRows,
} from "@/module/dashboard/help-support/components/tables/shared";
import {
  PASSWORD_RESET_STATUS_CONFIG,
} from "@/module/dashboard/help-support/components/status-config";
import { PasswordResetRequestDetailsModal } from "@/module/dashboard/help-support/components/modals/password-reset-request-details-modal";
import type { PasswordResetRequestRow } from "@/module/dashboard/help-support/data";
import { passwordResetRequestRows } from "@/module/dashboard/help-support/data";
import { createStatusColumn as createStatusColumnBase } from "@/components/table";
import { Button } from "@/components/ui/button";

const SEARCH_FIELDS: Array<keyof PasswordResetRequestRow> = [
  "logId",
  "username",
  "userEmail",
];

function createPasswordResetStatusColumn(
  header: string,
): ColumnDef<PasswordResetRequestRow, unknown> {
  return createStatusColumnBase<PasswordResetRequestRow, PasswordResetRequestRow["status"]>(
    header,
    PASSWORD_RESET_STATUS_CONFIG,
  );
}

function createActionColumnWithReset(options: {
  onView: (row: PasswordResetRequestRow) => void;
  onReset: (row: PasswordResetRequestRow) => void;
}): ColumnDef<PasswordResetRequestRow, unknown> {
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
  const [search, setSearch] = React.useState("");
  const [requests, setRequests] = React.useState<PasswordResetRequestRow[]>(passwordResetRequestRows);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);

  const rows = useFilteredRows(requests, search, SEARCH_FIELDS);
  const selectedRequest = selectedRequestId
    ? (requests.find((request) => request.id === selectedRequestId) ?? null)
    : null;

  const handleResetRequest = React.useCallback((requestId: string) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status: "reset" } : request,
      ),
    );
  }, []);

  const columns = React.useMemo<ColumnDef<PasswordResetRequestRow, unknown>[]>(
    () => [
      createSerialColumn(),
      createIdentifierColumn("Log ID", "logId"),
      createTextColumn("Initiator Name", "username"),
      createTextColumn("Initiator Email Address", "userEmail"),
      createTextColumn("Assigned Role", "assignedRole"),
      createTextColumn("Request Timestamp", "requestTimestampLabel"),
      createPasswordResetStatusColumn("Status"),
      createActionColumnWithReset({
        onView: (row) => setSelectedRequestId(row.id),
        onReset: (row) => handleResetRequest(row.id),
      }),
    ],
    [handleResetRequest],
  );

  return (
    <>
      <div className="space-y-4">
        <HelpSupportTableToolbar search={search} onSearchChange={setSearch} />
        <HelpSupportBaseTable rows={rows} columns={columns} />
      </div>

      {selectedRequest ? (
        <PasswordResetRequestDetailsModal
          key={selectedRequest.id}
          open={Boolean(selectedRequest)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRequestId(null);
            }
          }}
          request={selectedRequest}
          onReset={handleResetRequest}
        />
      ) : null}
    </>
  );
}
