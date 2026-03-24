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
import { formatCurrency } from "@/util/format-currency";
import { PAYMENTS_STATUS_CONFIG } from "@/module/dashboard/payments-settlements/components/status-config";
import type {
  PaymentSettlementRow,
  PaymentStatus,
} from "@/module/dashboard/payments-settlements/data";

export function createSerialColumn(): ColumnDef<PaymentSettlementRow, unknown> {
  return createSerialColumnBase<PaymentSettlementRow>();
}

export function createTextColumn(
  header: string,
  accessorKey: keyof PaymentSettlementRow & string,
  className?: string,
): ColumnDef<PaymentSettlementRow, unknown> {
  return createTextColumnBase<PaymentSettlementRow>(header, accessorKey, className);
}

export function createAmountColumn(
  header: string,
  accessorKey: keyof PaymentSettlementRow & string,
): ColumnDef<PaymentSettlementRow, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return <span>{formatCurrency(value)}</span>;
    },
  };
}

export function createIdentifierColumn(
  header: string,
  accessorKey: keyof PaymentSettlementRow & string,
): ColumnDef<PaymentSettlementRow, unknown> {
  return createIdentifierColumnBase<PaymentSettlementRow>(header, accessorKey);
}

export function createStatusColumn(header: string): ColumnDef<PaymentSettlementRow, unknown> {
  return createStatusColumnBase<PaymentSettlementRow, PaymentStatus>(
    header,
    PAYMENTS_STATUS_CONFIG,
  );
}

export function createActionColumnWithOptions(options?: {
  header?: string;
  ariaLabel?: string;
  onView?: (row: PaymentSettlementRow) => void;
}): ColumnDef<PaymentSettlementRow, unknown> {
  return createActionColumnWithOptionsBase<PaymentSettlementRow>(options);
}

export function PaymentsTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search Customer name or ID",
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

export function PaymentsBaseTable({
  rows,
  columns,
  pageSize = 10,
  totalEntries = 1000,
}: {
  rows: PaymentSettlementRow[];
  columns: ColumnDef<PaymentSettlementRow, unknown>[];
  pageSize?: number;
  totalEntries?: number;
}) {
  return (
    <BaseTable<PaymentSettlementRow>
      data={rows}
      columns={columns}
      pageSize={pageSize}
      totalEntries={totalEntries}
    />
  );
}

export function useFilteredPaymentRows(
  rows: PaymentSettlementRow[],
  search: string,
  fields: Array<keyof PaymentSettlementRow>,
) {
  return React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      fields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [fields, rows, search]);
}
