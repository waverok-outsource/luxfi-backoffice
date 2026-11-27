"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { ModalRoot } from "@/components/modal";
import { DataTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  absoluteTime,
  describeRate,
  formatPercentChange,
  pairLabel,
  percentChange,
  purposeLabel,
  relativeTime,
} from "@/module/dashboard/fx-rates/format";
import { useFxRateHistory } from "@/services/queries/fx-rate.queries";
import { useSettingsTeamMembers } from "@/services/queries/settings.queries";
import type { FxRatePurpose } from "@/types/fx-rate.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import getErrorMessage from "@/util/get-error-message";
import { getFullName } from "@/util/helper";

const HISTORY_LIMIT = 50;

export type FxRateHistoryTarget = { base: string; quote: string; purpose: FxRatePurpose };

type HistoryRow = {
  id: string;
  rate: string;
  createdAt: string;
  setBy: string;
  note: string;
  change: number | null;
  isCurrent: boolean;
};

export function FxRateHistoryDialog({
  target,
  onOpenChange,
}: {
  target: FxRateHistoryTarget | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, error } = useFxRateHistory(target ? { ...target, limit: HISTORY_LIMIT } : null);
  const { data: membersResponse } = useSettingsTeamMembers(convertObjectToQuery({ page: "1", limit: "100" }));

  const names = useMemo(
    () => new Map((membersResponse?.data ?? []).map((member) => [member.userId, getFullName(member)])),
    [membersResponse?.data],
  );

  if (!target) return null;
  const history = data?.data ?? [];

  // Rows come newest first, so each row's "previous" is the next one down.
  const rows: HistoryRow[] = history.map((item, index) => {
    const previous = history[index + 1];
    return {
      id: item._id,
      rate: item.rate,
      createdAt: item.createdAt,
      setBy: item.setBy ? (names.get(item.setBy) ?? item.setBy) : "-",
      note: item.note?.trim() || "-",
      change: previous ? percentChange(previous.rate, item.rate) : null,
      isCurrent: index === 0,
    };
  });

  const columns: ColumnDef<HistoryRow, unknown>[] = [
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <span className="flex items-center gap-2 whitespace-nowrap font-semibold text-text-black">
          {describeRate(target.base, target.quote, row.original.rate)}
          {row.original.isCurrent ? <Badge variant="neutral">Latest</Badge> : null}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Set at",
      cell: ({ row }) => (
        <span className="whitespace-nowrap" title={relativeTime(row.original.createdAt)}>
          {absoluteTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "setBy",
      header: "Set by",
      cell: ({ row }) => <span className="block max-w-[180px] truncate">{row.original.setBy}</span>,
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => <span className="block min-w-40 max-w-[260px] whitespace-normal">{row.original.note}</span>,
    },
    {
      accessorKey: "change",
      header: "Change",
      cell: ({ row }) => {
        const change = row.original.change;
        return (
          <span
            className={cn(
              "whitespace-nowrap font-medium",
              change == null ? "text-text-grey" : change > 0 ? "text-text-green" : change < 0 ? "text-text-red" : "",
            )}
          >
            {change == null ? "First rate" : formatPercentChange(change)}
          </span>
        );
      },
    },
  ];

  return (
    <ModalRoot
      open={Boolean(target)}
      onOpenChange={onOpenChange}
      showCloseButton
      title={`${pairLabel(target.base, target.quote)} · ${purposeLabel(target.purpose)} history`}
      description={`Every rate set for this pair and purpose, newest first (up to ${HISTORY_LIMIT}). Rates are never edited or deleted.`}
      contentClassName="max-h-[90vh] w-[calc(100%-2rem)] max-w-[960px] overflow-y-auto rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
    >
      <div className="mt-4">
        {error ? (
          <p role="alert" className="rounded-2xl bg-alertSoft-error px-4 py-3 text-sm text-text-red">
            {getErrorMessage(error)}
          </p>
        ) : (
          <DataTable columns={columns} data={rows} loading={isLoading} emptyStateLabel="No rates have been set yet." />
        )}
      </div>
    </ModalRoot>
  );
}
