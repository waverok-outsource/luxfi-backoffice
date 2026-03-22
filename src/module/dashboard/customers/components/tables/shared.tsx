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
  CustomerStatus,
  CustomerTableRow,
} from "@/module/dashboard/customers/data";

const CUSTOMER_STATUS_CONFIG = {
  active: { label: "Active", variant: "success" as const },
  blacklisted: { label: "Blacklisted", variant: "error" as const },
} satisfies Record<CustomerStatus, { label: string; variant: "success" | "error" }>;

export function createSerialColumn(): ColumnDef<CustomerTableRow, unknown> {
  return createSerialColumnBase<CustomerTableRow>();
}

export function createTextColumn(
  header: string,
  accessorKey: keyof CustomerTableRow & string,
  className?: string,
): ColumnDef<CustomerTableRow, unknown> {
  return createTextColumnBase<CustomerTableRow>(header, accessorKey, className);
}

export function createIdentifierColumn(
  header: string,
  accessorKey: keyof CustomerTableRow & string,
): ColumnDef<CustomerTableRow, unknown> {
  return createIdentifierColumnBase<CustomerTableRow>(header, accessorKey);
}

export function createStatusColumn(header: string): ColumnDef<CustomerTableRow, unknown> {
  return createStatusColumnBase<CustomerTableRow, CustomerStatus>(
    header,
    CUSTOMER_STATUS_CONFIG,
  );
}

export function createActionColumn(): ColumnDef<CustomerTableRow, unknown> {
  return createActionColumnWithOptionsBase<CustomerTableRow>();
}

export function createActionColumnWithOptions(options?: {
  header?: string;
  ariaLabel?: string;
  onView?: (row: CustomerTableRow) => void;
}): ColumnDef<CustomerTableRow, unknown> {
  return createActionColumnWithOptionsBase<CustomerTableRow>(options);
}

type CustomersBaseTableProps = {
  rows: CustomerTableRow[];
  columns: ColumnDef<CustomerTableRow, unknown>[];
  pageSize: number;
  totalEntries?: number;
};

export function CustomersBaseTable({
  rows,
  columns,
  pageSize,
  totalEntries,
}: CustomersBaseTableProps) {
  return (
    <BaseTable<CustomerTableRow>
      data={rows}
      columns={columns}
      pageSize={pageSize}
      totalEntries={totalEntries}
    />
  );
}
