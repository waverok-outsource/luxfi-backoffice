"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  BaseTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  TEAM_MANAGEMENT_TOTAL_ENTRIES,
  teamMembers,
  type TeamMemberRecord,
  type TeamMemberStatus,
} from "@/module/dashboard/system-settings/data";

type TeamManagementQuery = {
  page?: string;
};

type TeamManagementTableRow = Pick<
  TeamMemberRecord,
  "id" | "memberId" | "memberName" | "emailAddress" | "assignedRole" | "dateAdded" | "status"
>;

const PAGE_SIZE = 10;

function getStatusBadge(status: TeamMemberStatus) {
  switch (status) {
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "deactivated":
      return { variant: "error" as const, label: "Deactivated" };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

function createTruncatedTextColumn<TData extends Record<string, unknown>>(
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

export function TeamManagementTable() {
  const { value } = useURLQuery<TeamManagementQuery>();
  const { search } = useURLTableSearch();

  const searchQuery = search.trim().toLowerCase();
  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) {
      return teamMembers;
    }

    return teamMembers.filter(
      (member) =>
        member.memberId.toLowerCase().includes(searchQuery) ||
        member.memberName.toLowerCase().includes(searchQuery) ||
        member.emailAddress.toLowerCase().includes(searchQuery) ||
        member.assignedRole.toLowerCase().includes(searchQuery),
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const parsedPage = Number(value.page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<TeamManagementTableRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredMembers]);

  const columns = React.useMemo<ColumnDef<TeamManagementTableRow, unknown>[]>(
    () => [
      createSerialColumn<TeamManagementTableRow>(),
      createIdentifierColumn<TeamManagementTableRow>("Member ID", "memberId"),
      createTruncatedTextColumn<TeamManagementTableRow>(
        "Member Name",
        "memberName",
        "block max-w-[170px] truncate",
      ),
      createTruncatedTextColumn<TeamManagementTableRow>(
        "Email Address",
        "emailAddress",
        "block max-w-[220px] truncate",
      ),
      createTruncatedTextColumn<TeamManagementTableRow>(
        "Assigned Role",
        "assignedRole",
        "block max-w-[160px] truncate",
      ),
      createTruncatedTextColumn<TeamManagementTableRow>(
        "Date Added",
        "dateAdded",
        "block whitespace-nowrap",
      ),
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const badge = getStatusBadge(getValue() as TeamMemberStatus);

          return (
            <Badge variant={badge.variant} showStatusDot>
              {badge.label}
            </Badge>
          );
        },
      },
      createActionColumnWithOptions<TeamManagementTableRow>({
        ariaLabel: "View team member details",
      }),
    ],
    [],
  );

  return (
    <BaseTable<TeamManagementTableRow>
      data={rows}
      columns={columns}
      pageSize={PAGE_SIZE}
      totalEntries={searchQuery ? filteredMembers.length : TEAM_MANAGEMENT_TOTAL_ENTRIES}
      emptyStateLabel="No team members found."
    />
  );
}
