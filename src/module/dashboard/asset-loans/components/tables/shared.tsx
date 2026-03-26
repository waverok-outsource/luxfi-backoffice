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
  type StatusConfig,
  useFilteredTableRows,
} from "@/components/table";
import { formatCurrency } from "@/util/format-currency";

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
): ColumnDef<TData, unknown> {
  return createIdentifierColumnBase<TData>(header, accessorKey);
}

export function createCurrencyColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <span>{formatCurrency(Number(getValue() ?? 0))}</span>,
  };
}

export function createPercentColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <span>{Number(getValue() ?? 0).toFixed(1)}%</span>,
  };
}

export function createStatusColumn<
  TData extends { status?: TStatus },
  TStatus extends string = string,
>(header: string, config: StatusConfig<TStatus>) {
  return createStatusColumnBase<TData, TStatus>(header, config);
}

export function createActionColumnWithOptions<TData>(options?: {
  header?: string;
  ariaLabel?: string;
  onView?: (row: TData) => void;
}): ColumnDef<TData, unknown> {
  return createActionColumnWithOptionsBase<TData>(options);
}
export { TableSearchToolbar as AssetLoansTableToolbar };

export function AssetLoansBaseTable<TData>({
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
