"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { BaseTable, createSerialColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useCustomerVirtualAccounts } from "@/services/queries/customer.queries";
import type { CustomerVirtualAccountType } from "@/types/customer.type";
import { formatCurrency } from "@/util/format-currency";
import { formatDate, toTitleCase } from "@/util/helper";

export function VirtualAccountsPanel({ customerId }: { customerId: string }) {
  const { data: response, isLoading } = useCustomerVirtualAccounts(customerId);
  const accounts = response?.data ?? [];

  const columns: ColumnDef<CustomerVirtualAccountType>[] = [
    createSerialColumn<CustomerVirtualAccountType>({ offset: 0 }),
    {
      id: "accountNumber",
      header: "Account Number",
      cell: ({ row }) => (
        <span className="font-medium whitespace-nowrap">{row.original.addressNumber || "-"}</span>
      ),
    },
    {
      id: "bankName",
      header: "Bank",
      cell: ({ row }) => <span className="block max-w-[200px] truncate">{row.original.addressName || "-"}</span>,
    },
    {
      id: "currency",
      header: "Currency",
      cell: ({ row }) => <span>{row.original.currencyCode || "-"}</span>,
    },
    {
      id: "provider",
      header: "Provider",
      cell: ({ row }) => <span>{row.original.processor ? toTitleCase(row.original.processor) : "-"}</span>,
    },
    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatCurrency(row.original.balance, row.original.currencyCode)}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Date Created",
      cell: ({ row }) => (
        <span className="block whitespace-nowrap">
          {row.original.createdAt ? formatDate(row.original.createdAt, "dd - MM - yyyy") : "-"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge variant="success" showStatusDot>
            Active
          </Badge>
        ) : (
          <Badge variant="disabled" showStatusDot>
            Inactive
          </Badge>
        ),
    },
  ];

  return (
    <BaseTable<CustomerVirtualAccountType>
      data={accounts}
      columns={columns}
      loading={isLoading}
      totalEntries={accounts.length}
      pageSize={Math.max(accounts.length, 1)}
      emptyStateLabel="This customer has no virtual accounts yet."
    />
  );
}
