"use client";

import * as React from "react";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PaginationConfig = {
  totalEntries: number;
  pageSize: number;
  maxVisiblePages?: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  tableClassName?: string;
  emptyStateLabel?: string;
  loading?: boolean;
  pagination?: PaginationConfig;
  enableCheckbox?: boolean;
  /** Pins the last column (e.g. Action) to the right while horizontal scrolling. */
  stickyActionColumn?: boolean;
}

const skeletonWidthClasses = ["w-10", "w-24", "w-32", "w-40", "w-28", "w-20"];

const stickyActionHeaderClass =
  "sticky right-0 z-20 border-l border-primary-grey-stroke bg-[#F4F6F8] shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.06)]";
const stickyActionCellClass =
  "sticky right-0 z-10 border-l border-primary-grey-stroke bg-primary-white shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.06)] group-hover:bg-primary-grey-undertone/40 group-data-[state=selected]:bg-primary-grey-undertone/60";

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  tableClassName,
  emptyStateLabel = "No results.",
  loading = false,
  pagination,
  enableCheckbox = false,
  stickyActionColumn = false,
}: DataTableProps<TData, TValue>) {
  "use no memo";

  const totalEntries = pagination?.totalEntries ?? data.length;
  const pageSize = Math.max(1, pagination?.pageSize ?? (data.length || 1));
  const maxVisiblePages = Math.max(3, pagination?.maxVisiblePages ?? 3);
  const skeletonRowCount = Math.max(1, Math.min(pageSize, 10));
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(
    () =>
      loading
        ? columns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton
                className={cn(
                  "h-4 rounded-full",
                  skeletonWidthClasses[index % skeletonWidthClasses.length],
                )}
              />
            ),
          }))
        : columns,
    [columns, loading],
  );

  const tableData = React.useMemo<TData[]>(
    () => (loading ? Array.from({ length: skeletonRowCount }, () => ({}) as TData) : data),
    [data, loading, skeletonRowCount],
  );

  React.useEffect(() => {
    if (!enableCheckbox || loading) {
      setRowSelection({});
    }
  }, [enableCheckbox, loading, data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    enableRowSelection: enableCheckbox && !loading,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-primary-grey-stroke bg-primary-white",
        className,
      )}
    >
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIndex) => {
                const showHeaderCheckbox = enableCheckbox && headerIndex === 0;
                const isStickyAction =
                  stickyActionColumn && headerIndex === headerGroup.headers.length - 1;

                return (
                  <TableHead key={header.id} className={cn(isStickyAction && stickyActionHeaderClass)}>
                    {header.isPlaceholder ? null : showHeaderCheckbox ? (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          aria-label="Select all rows"
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(checked) =>
                            table.toggleAllPageRowsSelected(Boolean(checked))
                          }
                          disabled={loading}
                        />
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={stickyActionColumn ? "group" : undefined}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  const isStickyAction =
                    stickyActionColumn && cellIndex === row.getVisibleCells().length - 1;

                  return (
                  <TableCell key={cell.id} className={cn(isStickyAction && stickyActionCellClass)}>
                    {enableCheckbox && cellIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          aria-label={
                            loading ? `Loading row ${row.index + 1}` : `Select row ${row.index + 1}`
                          }
                          checked={row.getIsSelected()}
                          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
                          disabled={loading}
                        />
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyStateLabel}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && !loading ? (
        <TablePagination
          totalEntries={totalEntries}
          pageSize={pageSize}
          maxVisiblePages={maxVisiblePages}
        />
      ) : null}
    </div>
  );
}
