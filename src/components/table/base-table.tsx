"use client";

import { DataTable } from "@/components/table/data-table";
import type { BaseTableProps } from "@/components/table/types";

const DEFAULT_TOTAL_ENTRIES = 1000;

export function BaseTable<TData>({
  data,
  columns,
  pageSize,
  totalEntries = DEFAULT_TOTAL_ENTRIES,
  enableCheckbox = true,
  tableClassName = "w-full",
  className,
  emptyStateLabel,
  maxVisiblePages = 3,
}: BaseTableProps<TData>) {
  return (
    <DataTable<TData, unknown>
      columns={columns}
      data={data}
      tableClassName={tableClassName}
      className={className}
      emptyStateLabel={emptyStateLabel}
      enableCheckbox={enableCheckbox}
      pagination={{
        totalEntries,
        pageSize,
        maxVisiblePages,
      }}
    />
  );
}
