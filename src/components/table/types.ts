import type { ColumnDef } from "@tanstack/react-table";

import type { BadgeVariant } from "@/components/ui/badge";

export type TableRowBase = Record<string, string | number> & { id: string };

export type { BadgeVariant as StatusBadgeVariant } from "@/components/ui/badge";

export type StatusConfig<TStatus extends string> = Record<
  TStatus,
  { label: string; variant: BadgeVariant }
>;

export type BaseTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageSize: number;
  totalEntries?: number;
  enableCheckbox?: boolean;
  tableClassName?: string;
  className?: string;
  emptyStateLabel?: string;
  maxVisiblePages?: number;
};
