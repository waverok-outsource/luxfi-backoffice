"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

import { DataTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FxConverterPanel } from "@/module/dashboard/fx-rates/components/fx-converter-panel";
import {
  FxRateHistoryDialog,
  type FxRateHistoryTarget,
} from "@/module/dashboard/fx-rates/components/fx-rate-history-dialog";
import { SetFxRateDialog, type SetFxRatePrefill } from "@/module/dashboard/fx-rates/components/set-fx-rate-dialog";
import {
  absoluteTime,
  describeRate,
  pairLabel,
  purposeLabel,
  relativeTime,
} from "@/module/dashboard/fx-rates/format";
import { useFxRates } from "@/services/queries/fx-rate.queries";
import { FX_CURRENCIES, type FxCurrency, type FxRate } from "@/types/fx-rate.type";
import getErrorMessage from "@/util/get-error-message";
import { usePermission } from "@/util/permission";

const NO_PERMISSION_HINT = "You need the approvesettings permission to set rates.";

type RateRow = FxRate & { pair: string };

function isFxCurrency(value: string): value is FxCurrency {
  return (FX_CURRENCIES as readonly string[]).includes(value);
}

function sortRates(rates: FxRate[]) {
  return [...rates].sort(
    (a, b) =>
      a.base.localeCompare(b.base) ||
      a.quote.localeCompare(b.quote) ||
      // Payout first, then collection.
      (a.purpose === b.purpose ? 0 : a.purpose === "payout" ? -1 : 1),
  );
}

export function FxRatesSection() {
  const canSet = usePermission("approvesettings");
  const { data: response, isLoading, error } = useFxRates();
  const rates = response?.data ?? [];
  const [formState, setFormState] = useState<{ open: boolean; prefill: SetFxRatePrefill | null; key: number }>({
    open: false,
    prefill: null,
    key: 0,
  });
  const [historyTarget, setHistoryTarget] = useState<FxRateHistoryTarget | null>(null);

  const openForm = (prefill: SetFxRatePrefill | null) =>
    setFormState((prev) => ({ open: true, prefill, key: prev.key + 1 }));

  const stalePayout = rates.filter((rate) => rate.stale && rate.purpose === "payout");
  const staleCollection = rates.filter((rate) => rate.stale && rate.purpose === "collection");

  const rows: RateRow[] = sortRates(rates).map((rate) => ({ ...rate, pair: pairLabel(rate.base, rate.quote) }));

  const columns: ColumnDef<RateRow, unknown>[] = [
    {
      accessorKey: "pair",
      header: "Pair",
      cell: ({ row }) => <span className="whitespace-nowrap font-semibold text-text-black">{row.original.pair}</span>,
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => (
        <Badge variant={row.original.purpose === "payout" ? "neutral" : "warning"}>
          {purposeLabel(row.original.purpose)}
        </Badge>
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono text-sm text-text-black">
          {describeRate(row.original.base, row.original.quote, row.original.rate)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Set at",
      cell: ({ row }) => (
        <span
          className="cursor-help whitespace-nowrap underline decoration-dotted underline-offset-4"
          title={absoluteTime(row.original.createdAt)}
        >
          {relativeTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <span className="block min-w-32 max-w-[240px] whitespace-normal text-text-grey">
          {row.original.note?.trim() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "stale",
      header: "Status",
      cell: ({ row }) =>
        row.original.stale ? (
          <Badge variant="error" className="gap-1 font-semibold">
            <AlertTriangle className="size-3.5" />
            Stale
          </Badge>
        ) : (
          <Badge variant="success" showStatusDot>
            Current
          </Badge>
        ),
    },
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => {
        const { base, quote, purpose } = row.original;
        const prefillable = isFxCurrency(base) && isFxCurrency(quote);
        return (
          <div className="flex gap-2">
            <Button
              type="button"
              variant={row.original.stale ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-xl px-3 text-sm font-semibold"
              disabled={!canSet || !prefillable}
              title={!canSet ? NO_PERMISSION_HINT : undefined}
              onClick={() => prefillable && openForm({ base, quote, purpose })}
            >
              Update rate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-xl px-3 text-sm font-semibold"
              onClick={() => setHistoryTarget({ base, quote, purpose })}
            >
              History
            </Button>
          </div>
        );
      },
    },
  ];

  const showEmptyState = !isLoading && !error && rates.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text-black">Exchange rates</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-grey">
            A rate is how many units of the quote currency equal 1 unit of the base currency. Payout rates
            are used when we pay customers (amounts round down). Collection rates are used when we take
            repayments (amounts round up). Each new rate waits for another authorised user and the old
            one stays in history.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => openForm(null)}
          disabled={!canSet}
          title={!canSet ? NO_PERMISSION_HINT : undefined}
        >
          Set rate
        </Button>
      </div>

      {stalePayout.length || staleCollection.length ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-alert-error bg-alertSoft-error px-4 py-4 text-text-red">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Some exchange rates are stale.</p>
            <p>
              Stale payout rates block loan disbursements. Stale collection rates block customer repayments.
              Set a new rate to unblock them.
            </p>
            <ul className="list-disc pl-5">
              {stalePayout.length ? (
                <li>
                  Payout: {stalePayout.map((rate) => pairLabel(rate.base, rate.quote)).join(", ")}
                </li>
              ) : null}
              {staleCollection.length ? (
                <li>
                  Collection: {staleCollection.map((rate) => pairLabel(rate.base, rate.quote)).join(", ")}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-alertSoft-error px-4 py-4 text-sm text-text-red">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p>{getErrorMessage(error)}</p>
        </div>
      ) : showEmptyState ? (
        <div className="flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-primary-grey-stroke bg-primary-white px-6 py-12 text-center">
          <ArrowLeftRight className="size-8 text-primary-gold-brand" />
          <p className="text-base font-semibold text-text-black">No exchange rates set</p>
          <p className="max-w-md text-sm text-text-grey">
            No loan can be paid into a wallet in another currency until rates are set. Set a payout rate and
            a collection rate for each currency pair you support.
          </p>
          <Button
            type="button"
            onClick={() => openForm(null)}
            disabled={!canSet}
            title={!canSet ? NO_PERMISSION_HINT : undefined}
          >
            Set rate
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          loading={isLoading}
          emptyStateLabel="No exchange rates set."
          stickyActionColumn
        />
      )}

      <FxConverterPanel />

      {formState.open ? (
        <SetFxRateDialog
          key={formState.key}
          open={formState.open}
          onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
          prefill={formState.prefill}
          currentRates={rates}
        />
      ) : null}

      <FxRateHistoryDialog target={historyTarget} onOpenChange={(open) => !open && setHistoryTarget(null)} />
    </div>
  );
}
