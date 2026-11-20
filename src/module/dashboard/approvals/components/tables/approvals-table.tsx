"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  TableSearchToolbar,
  createSerialColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { Button } from "@/components/ui/button";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { ApprovalDetailsModal } from "@/module/dashboard/approvals/components/modals/approval-details-modal";
import { APPROVAL_STATUS_CONFIG } from "@/module/dashboard/approvals/data";
import useApprovalFns from "@/services/functions/approval.fns";
import { useApprovals } from "@/services/queries/approval.queries";
import type { ApprovalListScope, ApprovalStatus, ApprovalType } from "@/types/approval.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 10;

type ApprovalTableRow = {
  id: string;
  description: string;
  maker: string;
  madeAt: string;
  status: ApprovalStatus | "unknown";
};

function formatMadeAt(value: string) {
  return value ? formatDate(value, "dd MMM yyyy, h:mm a") : "-";
}

export function ApprovalsTable({ scope }: { scope: ApprovalListScope }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const [selectedApproval, setSelectedApproval] = React.useState<ApprovalType | null>(null);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { search } : {}),
  });

  const { data: response, isLoading } = useApprovals(scope, query);
  const approvals = React.useMemo(() => response?.data ?? [], [response?.data]);
  const approvalsById = React.useMemo(
    () => new Map(approvals.map((approval) => [approval.approvalId, approval])),
    [approvals],
  );
  const { approveRequest, rejectRequest, cancelRequest, loading } = useApprovalFns();

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: ApprovalTableRow[] = approvals.map((approval) => ({
    id: approval.approvalId,
    description: approval.description || "-",
    maker: approval.maker || "-",
    madeAt: formatMadeAt(approval.createdAt),
    status: approval.status,
  }));

  const columns: ColumnDef<ApprovalTableRow, unknown>[] = [
    createSerialColumn<ApprovalTableRow>({ offset: serialNumberOffset }),
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => {
        const description = String(getValue() ?? "-");
        return <span className="block min-w-40 whitespace-normal">{description}</span>;
      },
    },
    createTextColumn<ApprovalTableRow>("Made by", "maker", "block max-w-[180px]"),
    createTextColumn<ApprovalTableRow>("Made on", "madeAt", "block whitespace-nowrap"),
    createStatusColumn<ApprovalTableRow, ApprovalStatus | "unknown">("Status", APPROVAL_STATUS_CONFIG),
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-3 text-sm font-semibold"
          disabled={!row.original.id}
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

  const actionPending = loading.APPROVE || loading.REJECT || loading.CANCEL;

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder="Search description or maker" />
        <DataTable
          columns={columns}
          data={rows}
          loading={isLoading}
          emptyStateLabel={scope === "mine" ? "You have not created any approvals." : "No approvals found."}
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
          scope={scope}
          approvePending={loading.APPROVE}
          rejectPending={loading.REJECT}
          cancelPending={loading.CANCEL}
          actionPending={actionPending}
          onApprove={(approvalId, onSuccess) => {
            void approveRequest(approvalId, onSuccess);
          }}
          onReject={(approvalId, reason, onSuccess) => {
            void rejectRequest(approvalId, reason, onSuccess);
          }}
          onCancel={(approvalId, reason, onSuccess) => {
            void cancelRequest(approvalId, reason, onSuccess);
          }}
        />
      ) : null}
    </>
  );
}
