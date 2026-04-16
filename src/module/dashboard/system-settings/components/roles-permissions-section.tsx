"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Search, ChevronDown, PencilLine } from "lucide-react";

import { BaseTable, createIdentifierColumn, createSerialColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useSettingsPermissions, useSettingsRoles } from "@/services/queries/settings.queries";
import type { SettingsRoleType } from "@/types/settings.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset, toTitleCase } from "@/util/helper";
import RoleFormModal from "./modals/add-role-modal";

const PAGE_SIZE = 10;

function getStatusBadge(status: SettingsRoleType["status"]) {
  switch (status) {
    case "active":
      return { variant: "success" as const, label: "Active" };
    default:
      return { variant: "error" as const, label: toTitleCase(status) };
  }
}

export function RolesPermissionsSection() {
  const { search, setSearch } = useURLTableSearch();
  const { value } = useURLQuery<{ page?: string; from?: string; to?: string }>();
  const [isAddRoleOpen, setIsAddRoleOpen] = React.useState(false);
  const [editingRoleId, setEditingRoleId] = React.useState<string | null>(null);
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const { data: permissionsResponse, isLoading: isPermissionsLoading } = useSettingsPermissions();
  const arePermissionsReady = Boolean(permissionsResponse) && !isPermissionsLoading;

  const rolesQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: rolesResponse, isLoading } = useSettingsRoles(rolesQuery);
  const roles = rolesResponse?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: rolesResponse?.pagination,
  });

  const activeRole = editingRoleId
    ? (roles.find((role) => role.roleId === editingRoleId) ?? null)
    : null;

  const columns: ColumnDef<SettingsRoleType, unknown>[] = [
    createSerialColumn<SettingsRoleType>({ offset: serialNumberOffset }),
    createIdentifierColumn<SettingsRoleType>("Role ID", "roleId"),
    {
      accessorKey: "title",
      header: "Role Title",
      cell: ({ getValue }) => (
        <span className="block max-w-[220px] truncate">
          {toTitleCase(String(getValue() ?? "-"))}
        </span>
      ),
    },
    {
      accessorKey: "permissionsCount",
      header: "Permissions",
      cell: ({ getValue }) => <span>{Number(getValue() ?? 0)}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date Added",
      cell: ({ getValue }) => (
        <span className="block whitespace-nowrap">
          {formatDate(String(getValue() ?? ""), "dd - MM - yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const badge = getStatusBadge(getValue() as SettingsRoleType["status"]);

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
          onClick={() => setEditingRoleId(row.original.roleId)}
          disabled={!arePermissionsReady}
        >
          <PencilLine className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search role title or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              startAdornment={<Search className="h-5 w-5 text-text-grey" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
            >
              Filter Options
              <ChevronDown className="h-4 w-4 text-text-grey" />
            </Button>

            <Button
              type="button"
              className="h-12 rounded-2xl px-5"
              onClick={() => setIsAddRoleOpen(true)}
              disabled={!arePermissionsReady}
            >
              Add New Role
            </Button>
          </div>
        </div>

        <BaseTable<SettingsRoleType>
          data={roles}
          columns={columns}
          loading={isLoading}
          totalEntries={rolesResponse?.pagination.total ?? roles.length}
          pageSize={(rolesResponse?.pagination.perPage ?? PAGE_SIZE) || 1}
          enableCheckbox
          emptyStateLabel="No roles found."
        />
      </div>

      {isAddRoleOpen && (
        <RoleFormModal open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen} mode="add" />
      )}

      {activeRole && (
        <RoleFormModal
          open={Boolean(activeRole)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingRoleId(null);
            }
          }}
          role={activeRole}
          mode="edit"
        />
      )}
    </>
  );
}
