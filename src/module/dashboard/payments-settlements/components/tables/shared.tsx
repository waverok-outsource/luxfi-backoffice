"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useURLQuery } from "@/hooks/useUrlQuery";
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
  cellClassName?: string,
): ColumnDef<PaymentSettlementRow, unknown> {
  return createIdentifierColumnBase<PaymentSettlementRow>(header, accessorKey, cellClassName);
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
export { TableSearchToolbar as PaymentsTableToolbar };

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
export { useFilteredTableRows as useFilteredPaymentRows };

export type PaymentDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentSettlementRow;
};

type PaymentsHistoryTableProps = {
  sourceRows: PaymentSettlementRow[];
  searchFields: Array<keyof PaymentSettlementRow>;
  buildColumns: (
    onView: (row: PaymentSettlementRow) => void,
  ) => ColumnDef<PaymentSettlementRow, unknown>[];
  detailsModal?: ComponentType<PaymentDetailModalProps>;
  toolbarPlaceholder?: string;
};

export function PaymentsHistoryTable({
  sourceRows,
  searchFields,
  buildColumns,
  detailsModal: DetailsModal,
  toolbarPlaceholder,
}: PaymentsHistoryTableProps) {
  const { value } = useURLQuery<{ q?: string }>();
  const search = value.q ?? "";
  const [selectedPayment, setSelectedPayment] = useState<PaymentSettlementRow | null>(null);

  const rows = useFilteredTableRows(sourceRows, search, searchFields);

  const columns = useMemo(() => buildColumns(setSelectedPayment), [buildColumns]);

  return (
    <>
      <div className="space-y-4">
        <TableSearchToolbar placeholder={toolbarPlaceholder} />
        <PaymentsBaseTable rows={rows} columns={columns} pageSize={10} totalEntries={rows.length} />
      </div>

      {selectedPayment && DetailsModal ? (
        <DetailsModal
          open={Boolean(selectedPayment)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPayment(null);
            }
          }}
          payment={selectedPayment}
        />
      ) : null}
    </>
  );
}
