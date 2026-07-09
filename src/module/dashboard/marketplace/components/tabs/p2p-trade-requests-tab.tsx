"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createActionColumnWithOptions, createIdentifierColumn, createStatusColumn, createTextColumn } from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { P2PTradeDetailsModal } from "@/module/dashboard/marketplace/components/modals/p2p-trade-details-modal";
import { createAmountColumn, formatTableDateLabel, formatTableTimeLabel } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import { useP2PTradeRequestsContext } from "@/module/dashboard/marketplace/context";
import { P2P_TRADE_STATUS_CONFIG, resolveAssetItemById } from "@/module/dashboard/marketplace/data";
import type { P2PTradeRequestType, P2PTradeStatus } from "@/types/marketplace.type";

type P2PTradeRow = Record<string, unknown> & {
  id: string;
  assetId: string;
  assetName: string;
  lockedPrice: number;
  sellerName: string;
  buyerName: string;
  tradeDate: string;
  tradeTimestamp: string;
  status: P2PTradeStatus;
};

const PAGE_SIZE = 10;

function matchesQuery(trade: P2PTradeRequestType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const assetItem = resolveAssetItemById(trade.assetItemId);
  return (
    trade.assetItemId.toLowerCase().includes(normalized) ||
    trade.sellerName.toLowerCase().includes(normalized) ||
    trade.buyerName.toLowerCase().includes(normalized) ||
    Boolean(assetItem?.name.toLowerCase().includes(normalized))
  );
}

export function P2PTradeRequestsTab() {
  const { trades, updateTrade } = useP2PTradeRequestsContext();
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeTrade, setActiveTrade] = React.useState<P2PTradeRequestType | null>(null);

  const filtered = React.useMemo(
    () => trades.filter((trade) => matchesQuery(trade, value.q ?? "")),
    [trades, value.q],
  );

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(Math.floor(parsedPage), totalPages) : 1;

  const rows: P2PTradeRow[] = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((trade) => {
      const assetItem = resolveAssetItemById(trade.assetItemId);

      return {
        id: trade.tradeId,
        assetId: trade.assetItemId,
        assetName: assetItem?.name ?? "-",
        lockedPrice: trade.sellerAcceptedOffer,
        sellerName: trade.sellerName,
        buyerName: trade.buyerName,
        tradeDate: formatTableDateLabel(trade.submittedAt),
        tradeTimestamp: formatTableTimeLabel(trade.submittedAt),
        status: trade.status,
      };
    });
  }, [currentPage, filtered]);

  const columns: ColumnDef<P2PTradeRow, unknown>[] = [
    createIdentifierColumn<P2PTradeRow>("Asset ID", "assetId"),
    createTextColumn<P2PTradeRow>("Asset Name", "assetName", "max-w-[180px]"),
    createAmountColumn<P2PTradeRow>("Locked Price", "lockedPrice"),
    createTextColumn<P2PTradeRow>("Seller Name", "sellerName", "max-w-[160px]"),
    createTextColumn<P2PTradeRow>("Buyer Name", "buyerName", "max-w-[160px]"),
    createTextColumn<P2PTradeRow>("Date", "tradeDate"),
    createTextColumn<P2PTradeRow>("Timestamp", "tradeTimestamp"),
    createStatusColumn<P2PTradeRow, P2PTradeStatus>("Trade Status", P2P_TRADE_STATUS_CONFIG),
    createActionColumnWithOptions<P2PTradeRow>({
      ariaLabel: "Review P2P trade",
      onView: (row) => {
        const trade = trades.find((candidate) => candidate.tradeId === row.id);
        if (trade) setActiveTrade(trade);
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        emptyStateLabel="No P2P trade requests found."
        pagination={{ totalEntries: filtered.length, pageSize: PAGE_SIZE, maxVisiblePages: 3 }}
      />

      {activeTrade ? (
        <P2PTradeDetailsModal
          open={Boolean(activeTrade)}
          onOpenChange={(open) => {
            if (!open) setActiveTrade(null);
          }}
          trade={activeTrade}
          onTradeUpdated={(tradeId, patch) => {
            updateTrade(tradeId, patch);
            setActiveTrade((previous) => (previous ? { ...previous, ...patch } : previous));
          }}
        />
      ) : null}
    </>
  );
}
