"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  BaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useCustomers } from "@/services/queries/customer.queries";
import type { CustomerType } from "@/types/customer.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import {
  formatDate,
  getFullName,
  getKycTierLabel,
  getSerialNumberOffset,
  toTitleCase,
} from "@/util/helper";

const PAGE_SIZE = 10;

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "locked":
      return { variant: "warning" as const, label: "Locked" };
    case "inactive":
    case "blacklist":
    case "blacklisted":
    case "deactivate":
    case "deactivated":
      return { variant: "error" as const, label: toTitleCase(status) };
    default:
      return { variant: "disabled" as const, label: toTitleCase(status) || "-" };
  }
}

export function RegisteredCustomersTable() {
  const router = useRouter();
  const { value } = useURLQuery<{ page?: string; from?: string; to?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const customersQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: customersResponse, isLoading } = useCustomers(customersQuery);
  const customers = customersResponse?.data.customers ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: customersResponse?.pagination,
  });

  const columns: ColumnDef<CustomerType>[] = [
    createSerialColumn<CustomerType>({ offset: serialNumberOffset }),
    createIdentifierColumn<CustomerType>("Customer ID", "userId"),
    {
      id: "customerName",
      header: "Customer Name",
      cell: ({ row }) => (
        <span className="block max-w-[170px] truncate">{getFullName(row.original)}</span>
      ),
    },
    {
      id: "email",
      header: "Email Address",
      cell: ({ row }) => <span className="block max-w-[220px] truncate">{row.original.email}</span>,
    },
    {
      id: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => (
        <span className="block whitespace-nowrap">{row.original.phoneNumber || "-"}</span>
      ),
    },
    {
      id: "kycTier",
      header: "KYC Tier Level",
      cell: ({ row }) => <span>{getKycTierLabel(row.original)}</span>,
    },
    {
      id: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => (
        <span>{row.original.riskLevel ? toTitleCase(row.original.riskLevel) : "-"}</span>
      ),
    },
    {
      id: "dateOnboarded",
      header: "Date Onboarded",
      cell: ({ row }) => (
        <span className="block whitespace-nowrap">
          {formatDate(row.original.createdAt, "dd - MM - yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "accountStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const badge = getStatusBadge(String(getValue() ?? ""));

        return (
          <Badge variant={badge.variant} showStatusDot>
            {badge.label}
          </Badge>
        );
      },
    },
    createActionColumnWithOptions<CustomerType>({
      ariaLabel: "View customer profile details",
      onView: (row) => {
        router.push(`/customers/${encodeURIComponent(row.userRef)}`);
      },
    }),
  ];

  return (
    <BaseTable<CustomerType>
      data={customers}
      columns={columns}
      loading={isLoading}
      totalEntries={customersResponse?.pagination.total ?? customers.length}
      pageSize={(customersResponse?.pagination.perPage ?? PAGE_SIZE) || 1}
      emptyStateLabel="No customers found."
    />
  );
}
