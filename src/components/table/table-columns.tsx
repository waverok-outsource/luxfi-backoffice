"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StatusBadgeVariant, StatusConfig } from "@/components/table/types";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

function ActionCell({
  onView,
  ariaLabel = "View row details",
}: {
  onView?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      variant="table-action"
      size="table-action"
      onClick={onView}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}

function IdentifierCell({ value }: { value: string }) {
  const { copy } = useCopyToClipboard();
  const isCopyable = value.trim() !== "" && value.trim() !== "-";

  return (
    <div className="flex max-w-[180px] items-center gap-2">
      <span className="truncate">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="table-action"
        className="rounded-xl text-text-grey hover:bg-primary-grey-undertone hover:text-text-black disabled:pointer-events-none disabled:opacity-50"
        onClick={() => void copy(value)}
        disabled={!isCopyable}
        aria-label="Copy value"
      >
        <Copy className="h-4 w-4 shrink-0" />
      </Button>
    </div>
  );
}

export function createSerialColumn<TData>(options?: {
  offset?: number;
}): ColumnDef<TData, unknown> {
  return {
    id: "serialNumber",
    header: "S/N",
    cell: ({ row }) => <span>{(options?.offset ?? 0) + row.index + 1}.</span>,
  };
}

export function createTextColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
  className?: string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => (
      <span className={cn("truncate", className)}>{String(getValue() ?? "-")}</span>
    ),
  };
}

export function createIdentifierColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => <IdentifierCell value={String(getValue() ?? "-")} />,
  };
}

export function createStatusColumn<
  TData extends { status?: TStatus },
  TStatus extends string = string,
>(header: string, config: StatusConfig<TStatus>): ColumnDef<TData, unknown> {
  return {
    id: "status",
    header,
    cell: ({ row }) => {
      const status = row.original.status;
      if (status == null || !(status in config)) {
        return <span className="text-text-grey">-</span>;
      }
      const { label, variant } = config[status as TStatus] as {
        label: string;
        variant: StatusBadgeVariant;
      };
      return (
        <Badge variant={variant} showStatusDot className="text-sm">
          {label}
        </Badge>
      );
    },
  };
}

export type ActionColumnOptions<TData> = {
  header?: string;
  ariaLabel?: string;
  onView?: (row: TData) => void;
};

export function createActionColumnWithOptions<TData>(
  options?: ActionColumnOptions<TData>,
): ColumnDef<TData, unknown> {
  return {
    id: "rowActions",
    header: options?.header ?? "Action",
    cell: ({ row }) => {
      const ariaLabel = options?.ariaLabel ?? "View row details";
      const onView = options?.onView;
      const handleView = onView ? () => onView(row.original) : undefined;
      return <ActionCell ariaLabel={ariaLabel} onView={handleView} />;
    },
  };
}

export function createActionColumn<TData>(
  options?: ActionColumnOptions<TData>,
): ColumnDef<TData, unknown> {
  return createActionColumnWithOptions(options);
}
