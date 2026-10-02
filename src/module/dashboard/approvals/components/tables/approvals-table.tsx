"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  TableSearchToolbar,
  createIdentifierColumn,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ApprovalDetailsModal } from "@/module/dashboard/approvals/components/modals/approval-details-modal";
import { APPROVAL_STATUS_CONFIG } from "@/module/dashboard/approvals/data";
import useApprovalFns from "@/services/functions/approval.fns";
import { useApprovals } from "@/services/queries/approval.queries";
import {
  getApprovalRequestTarget,
  type ApprovalStatus,
  type ApprovalType,
} from "@/types/approval.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type ApprovalTableRow = {
  id: string;
  approvalId: string;
  method: string;
  requestTarget: string;
  description: string;
  maker: string;
  unit: string;
  status: ApprovalStatus | "unknown";
};

export function ApprovalsTable() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedApproval, setSelectedApproval] = React.useState<ApprovalType | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
  });

  const { data: response, isLoading } = useApprovals(query);
  const approvals = React.useMemo(() => response?.data ?? [], [response?.data]);
  const approvalsById = React.useMemo(
    () => new Map(approvals.map((approval) => [approval.approvalId, approval])),
    [approvals],
  );
  const { approveRequest, loading } = useApprovalFns();

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: ApprovalTableRow[] = approvals.map((approval) => ({
    id: approval.approvalId,
    approvalId: approval.approvalId,
    method: approval.method,
    requestTarget: getApprovalRequestTarget(approval),
    description: approval.description?.trim() || "-",
    maker: approval.maker?.trim() || "-",
    unit: approval.unit?.trim() || "-",
    status: approval.status,
  }));

  const columns: ColumnDef<ApprovalTableRow, unknown>[] = [
      createSerialColumn<ApprovalTableRow>({ offset: serialNumberOffset }),
      createIdentifierColumn<ApprovalTableRow>("Approval ID", "approvalId"),
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ getValue }) => (
          <Badge variant="neutral" className="font-semibold">
            {String(getValue() || "-")}
          </Badge>
        ),
      },
      {
        accessorKey: "requestTarget",
        header: "Path",
        cell: ({ getValue }) => {
          const path = String(getValue() ?? "-");
          return (
            <span className="block max-w-[220px] truncate" title={path}>
              {path}
            </span>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => {
          const description = String(getValue() ?? "-");
          return (
            <span className="block max-w-[220px] truncate" title={description}>
              {description}
            </span>
          );
        },
      },
      createTextColumn<ApprovalTableRow>("Maker", "maker", "block max-w-[160px]"),
      createTextColumn<ApprovalTableRow>("Unit", "unit", "block max-w-[140px]"),
      createStatusColumn<ApprovalTableRow, ApprovalStatus | "unknown">(
        "Status",
        APPROVAL_STATUS_CONFIG,
      ),
      {
        id: "rowActions",
        header: "Action",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-xl px-3 text-sm font-semibold"
            onClick={() => {
              const approval = approvalsById.get(row.original.id);
              if (approval) {
                setSelectedApproval(approval);
              }
            }}
          >
            View more
          </Button>
        ),
      },
  ];

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search approval ID, maker, or unit" />
        <DataTable
          columns={columns}
          data={rows}
          loading={isLoading}
          emptyStateLabel="No approvals found."
          stickyActionColumn
          pagination={{
            totalEntries: response?.pagination?.total ?? rows.length,
            pageSize: PAGE_SIZE,
            maxVisiblePages: 3,
          }}
        />
      </div>

      {selectedApproval ? (
        <ApprovalDetailsModal
          key={selectedApproval.approvalId}
          open={Boolean(selectedApproval)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedApproval(null);
            }
          }}
          approval={selectedApproval}
          approvePending={loading.APPROVE}
          onApprove={(approval, onSuccess) => {
            void approveRequest(approval, onSuccess);
          }}
        />
      ) : null}
    </>
  );
}
