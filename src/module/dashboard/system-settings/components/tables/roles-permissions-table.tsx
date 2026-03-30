"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilLine } from "lucide-react";

import { BaseTable, createIdentifierColumn, createSerialColumn, createTextColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import {
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
    default:
      return { variant: "error" as const, label: "Deactivated" };
  }
}

export function RolesPermissionsTable({
  roles,
  onEdit,
}: {
  roles: RolePermissionRecord[];
  onEdit: (role: RolePermissionRecord) => void;
}) {
  const { value } = useURLQuery<RolesPermissionsQuery>();
  const { search } = useURLTableSearch();

  const searchQuery = search.trim().toLowerCase();
  const filteredRoles = React.useMemo(() => {
    if (!searchQuery) {
      return roles;
    }

    return roles.filter(
      (role) =>
        role.roleTag.toLowerCase().includes(searchQuery) ||
        role.roleId.toLowerCase().includes(searchQuery) ||
        role.status.toLowerCase().includes(searchQuery),
    );
  }, [roles, searchQuery]);

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
      createIdentifierColumn<RolePermissionRecord>("Role ID", "roleId"),
      createTextColumn<RolePermissionRecord>("Role Tag", "roleTag", "max-w-[220px]"),
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ getValue }) => <span>{Number(getValue() ?? 0)}</span>,
      },
      createTextColumn<RolePermissionRecord>("Date Added", "dateAdded", "whitespace-nowrap"),
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
      {
        id: "rowActions",
        header: "Action",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="table-action"
            size="table-action"
            aria-label="Edit role details"
            onClick={() => onEdit(row.original)}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [onEdit],
  );

  return (
    <BaseTable<RolePermissionRecord>
      data={rows}
      columns={columns}
      pageSize={PAGE_SIZE}
      totalEntries={filteredRoles.length}
      enableCheckbox
      emptyStateLabel="No roles found."
    />
  );
}
