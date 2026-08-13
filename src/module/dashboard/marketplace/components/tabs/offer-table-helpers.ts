import type { ColumnDef } from "@tanstack/react-table";

import { formatCurrency } from "@/util/format-currency";

export function createAmountColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => formatCurrency(Number(getValue())),
  };
}

export function formatTableDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTableTimeLabel(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Orders status values aren't a confirmed closed enum (only "pending"/"Pending" has been
 * sampled) — this heuristic keeps unseen values visible with a reasonable badge tone instead
 * of forcing them through a fixed config and silently falling back to "-".
 */
export function resolveOrderStatusVariant(status: string): "success" | "warning" | "error" {
  const normalized = status.toLowerCase();

  if (/reject|cancel|fail|declin/.test(normalized)) {
    return "error";
  }

  if (/approv|complet|paid|settl|success/.test(normalized)) {
    return "success";
  }

  return "warning";
}
