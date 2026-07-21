"use client";

import { DataTable } from "@/components/table/data-table";
import type { BaseTableProps } from "@/components/table/types";

export function BaseTable<TData>({
  data,
  columns,
  pageSize,
  totalEntries = data.length,
  loading = false,
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
      loading={loading}
      enableCheckbox={enableCheckbox}
      pagination={{
        totalEntries,
        pageSize,
        maxVisiblePages,
      }}
    />
  );
}
