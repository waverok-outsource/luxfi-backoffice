"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  BaseTable,
  TableSearchToolbar,
  createActionColumnWithOptions as createActionColumnWithOptionsBase,
  createIdentifierColumn as createIdentifierColumnBase,
  createSerialColumn as createSerialColumnBase,
  createStatusColumn as createStatusColumnBase,
  createTextColumn as createTextColumnBase,
  useFilteredTableRows,
} from "@/components/table";
import { HELP_SUPPORT_STATUS_CONFIG } from "@/module/dashboard/help-support/components/status-config";
import type { SupportTicketStatus } from "@/module/dashboard/help-support/data";

type HelpSupportRowBase = {
  id: string;
  status: SupportTicketStatus;
};

export function createSerialColumn<TData>(): ColumnDef<TData, unknown> {
  return createSerialColumnBase<TData>();
}

export function createTextColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
  className?: string,
): ColumnDef<TData, unknown> {
  return createTextColumnBase<TData>(header, accessorKey, className);
}

export function createIdentifierColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
  cellClassName?: string,
): ColumnDef<TData, unknown> {
  return createIdentifierColumnBase<TData>(header, accessorKey, cellClassName);
}

export function createStatusColumn<TData extends HelpSupportRowBase>(
  header: string,
): ColumnDef<TData, unknown> {
  return createStatusColumnBase<TData, SupportTicketStatus>(header, HELP_SUPPORT_STATUS_CONFIG);
}

export function createActionColumnWithOptions<TData>(options?: {
  header?: string;
  ariaLabel?: string;
  onView?: (row: TData) => void;
}): ColumnDef<TData, unknown> {
  return createActionColumnWithOptionsBase<TData>(options);
}
export { TableSearchToolbar as HelpSupportTableToolbar };

export function HelpSupportBaseTable<TData>({
  rows,
  columns,
  pageSize = 5,
  totalEntries = 1000,
}: {
  rows: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageSize?: number;
  totalEntries?: number;
}) {
  return (
    <BaseTable<TData>
      data={rows}
      columns={columns}
      pageSize={pageSize}
      totalEntries={totalEntries}
    />
  );
}
export { useFilteredTableRows as useFilteredRows };
