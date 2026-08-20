"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Copy, Eye } from "lucide-react";

import { TableSearchToolbar } from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { formatCurrency } from "@/util/format-currency";
import {
  TransactionDetailsModal,
  type TransactionDetails,
  type TransactionStatus,
} from "@/module/dashboard/customers/customer-details/components/transactions/transaction-details-modal";

type TransactionRow = {
  id: string;
  logId: string;
  amount: number;
  type: "Credit" | "Debit";
  category: string;
  date: string;
  status: TransactionStatus;
  flagged: boolean;
};

const PAGE_SIZE = 10;

function truncateMiddle(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const head = Math.max(4, Math.floor(maxLength * 0.6));
  const tail = Math.max(3, maxLength - head - 3);
  return `${value.slice(0, head)}...${value.slice(value.length - tail)}`;
}

function StatusCell({
  status,
  flagged,
}: {
  status: TransactionStatus;
  flagged: boolean;
}) {
  const isCompleted = status === "COMPLETED";

  return (
    <div className="flex items-center gap-2">
      {flagged ? (
        <AlertTriangle className="h-4 w-4 text-text-red" />
      ) : null}

      <Badge
        variant={isCompleted ? "success" : "disabled"}
        showStatusDot
      >
        {isCompleted ? "Completed" : "Failed"}
      </Badge>
    </div>
  );
}

function LogIdCell({
  value,
  onCopy,
}: {
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="flex max-w-[220px] items-center gap-2">
      <span className="truncate">{truncateMiddle(value, 12)}</span>

      <Button
        type="button"
        variant="ghost"
        size="table-action"
        className="rounded-xl text-text-grey hover:bg-primary-grey-undertone hover:text-text-black"
        onClick={() => onCopy(value)}
        aria-label="Copy transaction log ID"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TransactionHistoryPanel() {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const search = value.q ?? "";

  const [transactions, setTransactions] = React.useState<TransactionRow[]>(
    [],
  );

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { copy } = useCopyToClipboard();

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return transactions;

    return transactions.filter((txn) =>
      txn.logId.toLowerCase().includes(query),
    );
  }, [search, transactions]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const pagedRows = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  const selectedTransaction = React.useMemo(() => {
    if (!selectedId) return null;

    const row = transactions.find((txn) => txn.id === selectedId);

    if (!row) return null;

    const details: TransactionDetails = {
      id: row.id,
      logId: row.logId,
      status: row.status,
      category:
        row.category === "Wallet" ? "Asset Purchase" : row.category,
      type: row.type,
      dateLabel: "10th January, 2026",
      timestampLabel: "07:20 AM",
      paymentMethod: "USDT",
      paymentChannel: "Wallet",
      contractAddress: "0ex6753w8363444",
      amountLabel: formatCurrency(row.amount),
      flagged: row.flagged,
    };

    return details;
  }, [selectedId, transactions]);

  const handleToggleFlag = (id: string) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === id
          ? { ...txn, flagged: !txn.flagged }
          : txn,
      ),
    );
  };

  const columns = React.useMemo<
    ColumnDef<TransactionRow, unknown>[]
  >(() => {
    return [
      {
        id: "serialNumber",
        header: "S/N",
        cell: ({ row }) => <span>{row.index + 1}.</span>,
      },
      {
        accessorKey: "logId",
        header: "Transaction Log ID",
        cell: ({ getValue }) => (
          <LogIdCell
            value={String(getValue() ?? "-")}
            onCopy={(value) => void copy(value)}
          />
        ),
      },
      {
        accessorKey: "amount",
        header: "Transaction Amount",
        cell: ({ getValue }) => (
          <span>
            {formatCurrency(Number(getValue() ?? 0))}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        id: "statusId",
        header: "Status ID",
        cell: ({ row }) => (
          <StatusCell
            status={row.original.status}
            flagged={row.original.flagged}
          />
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            type="button"
            aria-label="View transaction details"
            variant="table-action"
            size="table-action"
            onClick={() => setSelectedId(row.original.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ];
  }, [copy]);

  return (
    <div className="space-y-4">
      <TableSearchToolbar placeholder="Search Transaction ID" />

     <DataTable<TransactionRow, unknown>
  columns={columns}
  data={pagedRows}
  emptyStateLabel="No results"
  enableCheckbox
  pagination={{
    totalEntries: filtered.length,
    pageSize: PAGE_SIZE,
    maxVisiblePages: 3,
  }}
/>

      {selectedTransaction ? (
        <TransactionDetailsModal
          open={Boolean(selectedTransaction)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setSelectedId(null);
          }}
          transaction={selectedTransaction}
          onToggleFlag={handleToggleFlag}
        />
      ) : null}
    </div>
  );
}