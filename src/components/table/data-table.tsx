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
  pagination?: PaginationConfig;
  enableCheckbox?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  tableClassName,
  emptyStateLabel = "No results.",
  pagination,
  enableCheckbox = false,
}: DataTableProps<TData, TValue>) {
  "use no memo";

  const totalEntries = pagination?.totalEntries ?? data.length;
  const pageSize = Math.max(1, pagination?.pageSize ?? (data.length || 1));
  const maxVisiblePages = Math.max(3, pagination?.maxVisiblePages ?? 3);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  React.useEffect(() => {
    if (!enableCheckbox) {
      setRowSelection({});
    }
  }, [enableCheckbox, data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: enableCheckbox,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-white",
        className,
      )}
    >
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIndex) => {
                const showHeaderCheckbox = enableCheckbox && headerIndex === 0;

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : showHeaderCheckbox ? (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          aria-label="Select all rows"
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(checked) =>
                            table.toggleAllPageRowsSelected(Boolean(checked))
                          }
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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell key={cell.id}>
                    {enableCheckbox && cellIndex === 0 ? (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          aria-label={`Select row ${row.index + 1}`}
                          checked={row.getIsSelected()}
                          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
                        />
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
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

      {pagination ? (
        <TablePagination
          totalEntries={totalEntries}
          pageSize={pageSize}
          maxVisiblePages={maxVisiblePages}
        />
      ) : null}
    </div>
  );
}
