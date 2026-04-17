"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BaseTable,
  TableSearchField,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { useSettingsTeamMembers } from "@/services/queries/settings.queries";
import type { SettingsTeamMemberType } from "@/types/settings.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getFullName, getSerialNumberOffset, toTitleCase } from "@/util/helper";
import TeamMemberFormModal from "./modals/add-team-member-modal";

const PAGE_SIZE = 10;

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return { variant: "success" as const, label: "Active" };
    case "inactive":
    case "blacklist":
      return { variant: "error" as const, label: toTitleCase(status) };
    default:
      return { variant: "disabled" as const, label: "-" };
  }
}

export function TeamManagementSection() {
  const router = useRouter();
  const { value } = useURLQuery<{ page?: string; from?: string; to?: string; q?: string }>();
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = React.useState(false);
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const teamMembersQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
    ...(value.from ? { from: value.from } : {}),
    ...(value.to ? { to: value.to } : {}),
  });

  const { data: teamMembersResponse, isLoading } = useSettingsTeamMembers(teamMembersQuery);
  const members = teamMembersResponse?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: teamMembersResponse?.pagination,
  });

  const columns: ColumnDef<SettingsTeamMemberType>[] = [
    createSerialColumn<SettingsTeamMemberType>({ offset: serialNumberOffset }),
    createIdentifierColumn<SettingsTeamMemberType>("Member ID", "userId"),
    {
      id: "memberName",
      header: "Member Name",
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
      id: "assignedRole",
      header: "Assigned Role",
      cell: ({ row }) => (
        <span className="block max-w-[160px] truncate">{toTitleCase(row.original.roleTitle)}</span>
      ),
    },
    {
      id: "dateAdded",
      header: "Date Added",
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
    createActionColumnWithOptions<SettingsTeamMemberType>({
      ariaLabel: "View team member details",
      onView: (row) => {
        router.push(`/system-settings/${encodeURIComponent(row.userRef)}`);
      },
    }),
  ];

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TableSearchField placeholder="Search user name or ID" className="max-w-md" />

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
              onClick={() => setIsAddTeamMemberOpen(true)}
            >
              Add New Member
            </Button>
          </div>
        </div>

        <BaseTable<SettingsTeamMemberType>
          data={members}
          columns={columns}
          loading={isLoading}
          totalEntries={teamMembersResponse?.pagination.total ?? members.length}
          pageSize={(teamMembersResponse?.pagination.perPage ?? PAGE_SIZE) || 1}
          emptyStateLabel="No team members found."
        />
      </div>

      {isAddTeamMemberOpen && (
        <TeamMemberFormModal
          open={isAddTeamMemberOpen}
          onOpenChange={setIsAddTeamMemberOpen}
          mode="add"
        />
      )}
    </>
  );
}
