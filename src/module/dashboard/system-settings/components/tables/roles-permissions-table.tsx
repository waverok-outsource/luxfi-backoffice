"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { BaseTable, createActionColumnWithOptions, createSerialColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  rolePermissionSettings,
  type RolePermissionRecord,
  type RolePermissionStatus,
} from "@/module/dashboard/system-settings/data";

type RolesPermissionsQuery = {
  page?: string;
};

const PAGE_SIZE = 5;

function getStatusBadge(status: RolePermissionStatus) {
  switch (status) {
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "draft":
      return { variant: "warning" as const, label: "Draft" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function createTruncatedColumn<TData extends Record<string, unknown>>(
  header: string,
  accessorKey: keyof TData & string,
  className: string,
): ColumnDef<TData, unknown> {
  return {
    accessorKey,
    header,
    cell: ({ getValue }) => (
      <span className={className}>{String(getValue() ?? "-")}</span>
    ),
  };
}

export function RolesPermissionsTable() {
  const { value } = useURLQuery<RolesPermissionsQuery>();
  const { search } = useURLTableSearch();

  const searchQuery = search.trim().toLowerCase();
  const filteredRoles = React.useMemo(() => {
    if (!searchQuery) {
      return rolePermissionSettings;
    }

    return rolePermissionSettings.filter(
      (role) =>
        role.roleName.toLowerCase().includes(searchQuery) ||
        role.accessScope.toLowerCase().includes(searchQuery) ||
        role.permissionsSummary.toLowerCase().includes(searchQuery),
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / PAGE_SIZE));
  const parsedPage = Number(value.page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<RolePermissionRecord[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredRoles.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRoles]);

  const columns = React.useMemo<ColumnDef<RolePermissionRecord, unknown>[]>(
    () => [
      createSerialColumn<RolePermissionRecord>(),
      createTruncatedColumn<RolePermissionRecord>(
        "Role Name",
        "roleName",
        "block max-w-[160px] truncate",
      ),
      createTruncatedColumn<RolePermissionRecord>(
        "Access Scope",
        "accessScope",
        "block max-w-[220px] truncate",
      ),
      {
        accessorKey: "assignedMembers",
        header: "Assigned Members",
        cell: ({ getValue }) => <span>{Number(getValue() ?? 0)}</span>,
      },
      createTruncatedColumn<RolePermissionRecord>(
        "Permissions",
        "permissionsSummary",
        "block max-w-[260px] truncate",
      ),
      createTruncatedColumn<RolePermissionRecord>(
        "Last Updated",
        "lastUpdated",
        "block whitespace-nowrap",
      ),
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const badge = getStatusBadge(getValue() as RolePermissionStatus);

          return (
            <Badge variant={badge.variant} showStatusDot>
              {badge.label}
            </Badge>
          );
        },
      },
      createActionColumnWithOptions<RolePermissionRecord>({
        ariaLabel: "View role details",
      }),
    ],
    [],
  );

  return (
    <BaseTable<RolePermissionRecord>
      data={rows}
      columns={columns}
      pageSize={PAGE_SIZE}
      totalEntries={filteredRoles.length}
      enableCheckbox={false}
      emptyStateLabel="No roles found."
    />
  );
}
