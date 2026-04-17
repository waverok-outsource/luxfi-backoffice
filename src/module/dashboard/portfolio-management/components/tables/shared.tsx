"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  BaseTable,
  createActionColumnWithOptions as createActionColumnWithOptionsBase,
  createIdentifierColumn as createIdentifierColumnBase,
  createSerialColumn as createSerialColumnBase,
  createStatusColumn as createStatusColumnBase,
  createTextColumn as createTextColumnBase,
} from "@/components/table";
import type {
  PortfolioStatus,
  PortfolioTableRow,
} from "@/module/dashboard/portfolio-management/data";

const PORTFOLIO_STATUS_CONFIG = {
  published: { label: "Published", variant: "success" as const },
  completed: { label: "Completed", variant: "success" as const },
  unpublished: { label: "Unpublished", variant: "error" as const },
  pending: { label: "Pending", variant: "warning" as const },
  rejected: { label: "Rejected", variant: "error" as const },
  approved: { label: "Approved", variant: "success" as const },
} satisfies Record<PortfolioStatus, { label: string; variant: "success" | "warning" | "error" }>;

export function createSerialColumn(): ColumnDef<PortfolioTableRow, unknown> {
  return createSerialColumnBase<PortfolioTableRow>();
}

export function createTextColumn(
  header: string,
  accessorKey: keyof PortfolioTableRow & string,
  className?: string,
): ColumnDef<PortfolioTableRow, unknown> {
  return createTextColumnBase<PortfolioTableRow>(header, accessorKey, className);
}

export function createIdentifierColumn(
  header: string,
  accessorKey: keyof PortfolioTableRow & string,
  cellClassName?: string,
): ColumnDef<PortfolioTableRow, unknown> {
  return createIdentifierColumnBase<PortfolioTableRow>(header, accessorKey, cellClassName);
}

export function createStatusColumn(header: string): ColumnDef<PortfolioTableRow, unknown> {
  return createStatusColumnBase<PortfolioTableRow, PortfolioStatus>(
    header,
    PORTFOLIO_STATUS_CONFIG,
  );
}

export function createActionColumn(): ColumnDef<PortfolioTableRow, unknown> {
  return createActionColumnWithOptionsBase<PortfolioTableRow>();
}

export function createActionColumnWithOptions(options?: {
  header?: string;
  ariaLabel?: string;
  onView?: (row: PortfolioTableRow) => void;
}): ColumnDef<PortfolioTableRow, unknown> {
  return createActionColumnWithOptionsBase<PortfolioTableRow>(options);
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
  totalEntries,
}: PortfolioBaseTableProps) {
  return (
    <BaseTable<PortfolioTableRow>
      data={rows}
      columns={columns}
      pageSize={pageSize}
      totalEntries={totalEntries}
    />
  );
}
