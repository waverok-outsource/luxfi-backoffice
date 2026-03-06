"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PortfolioStatus,
  PortfolioTableRow,
} from "@/module/dashboard/portfolio-management/data";

const statusBadgeConfig: Record<
  PortfolioStatus,
  { label: string; variant: "success" | "warning" | "error" | "disabled" }
> = {
  published: { label: "Published", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  unpublished: { label: "Unpublished", variant: "error" },
  pending: { label: "Pending", variant: "warning" },
  rejected: { label: "Rejected", variant: "error" },
  approved: { label: "Approved", variant: "success" },
};

const DEFAULT_TOTAL_ENTRIES = 1000;

function StatusBadge({ status }: { status: PortfolioStatus }) {
  const config = statusBadgeConfig[status];

  return (
    <Badge variant={config.variant} showStatusDot className="text-sm">
      {config.label}
    </Badge>
  );
}

function ActionCell() {
  return (
    <Button aria-label="View row details" variant="table-action" size="table-action">
      <Eye className="h-4 w-4" />
    </Button>
  );
}

function IdentifierCell({ value }: { value: string }) {
  return (
    <div className="flex max-w-[180px] items-center gap-2">
      <span className="truncate">{value}</span>
      <Copy className="h-4 w-4 shrink-0 text-alert-disabled" />
    </div>
  );
}

export function createSerialColumn(): ColumnDef<PortfolioTableRow, unknown> {
  return {
    id: "serialNumber",
    header: "S/N",
    cell: ({ row }) => <span>{row.index + 1}.</span>,
  };
}

export function createTextColumn(
  header: string,
  accessorKey: string,
  className?: string,
): ColumnDef<PortfolioTableRow, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => (
      <span className={cn("truncate", className)}>{String(getValue() ?? "-")}</span>
    ),
  };
}

export function createIdentifierColumn(
  header: string,
  accessorKey: string,
): ColumnDef<PortfolioTableRow, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <IdentifierCell value={String(getValue() ?? "-")} />,
  };
}

export function createStatusColumn(header: string): ColumnDef<PortfolioTableRow, unknown> {
  return {
    id: "status",
    header,
    cell: ({ row }) => {
      const rowStatus = row.original.status;
      if (!rowStatus) {
        return <span className="text-text-grey">-</span>;
      }

      return <StatusBadge status={rowStatus} />;
    },
  };
}

export function createActionColumn(): ColumnDef<PortfolioTableRow, unknown> {
  return {
    id: "action",
    header: "Action",
    cell: () => <ActionCell />,
  };
}

type PortfolioBaseTableProps = {
  rows: PortfolioTableRow[];
  columns: ColumnDef<PortfolioTableRow, unknown>[];
  pageSize: number;
  totalEntries?: number;
};

export function PortfolioBaseTable({
  rows,
  columns,
  pageSize,
  totalEntries = DEFAULT_TOTAL_ENTRIES,
}: PortfolioBaseTableProps) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      tableClassName="w-full"
      enableCheckbox
      pagination={{
        totalEntries,
        pageSize,
        maxVisiblePages: 3,
      }}
    />
  );
}
