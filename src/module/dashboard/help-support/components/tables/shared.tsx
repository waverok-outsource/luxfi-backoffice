"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";

import {
  BaseTable,
  createActionColumnWithOptions as createActionColumnWithOptionsBase,
  createIdentifierColumn as createIdentifierColumnBase,
  createSerialColumn as createSerialColumnBase,
  createStatusColumn as createStatusColumnBase,
  createTextColumn as createTextColumnBase,
} from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
): ColumnDef<TData, unknown> {
  return createIdentifierColumnBase<TData>(header, accessorKey);
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

export function HelpSupportTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search user name or ID",
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full max-w-md">
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          startAdornment={<Search className="h-5 w-5 text-text-grey" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
        >
          Filter Options
          <ChevronDown className="h-4 w-4 text-text-grey" />
        </Button>
      </div>
    </div>
  );
}

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

export function useFilteredRows<TData extends Record<string, unknown>>(
  rows: TData[],
  search: string,
  fields: Array<keyof TData>,
) {
  return React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      fields.some((field) => String(row[field] ?? "").toLowerCase().includes(query)),
    );
  }, [fields, rows, search]);
}
