"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import {
  DataTable,
  TableSearchField,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
} from "@/components/table";
import { Button } from "@/components/ui/button";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { UserActivityDetailsModal } from "@/module/dashboard/system-settings/member-details/components/user-activity-details-modal";
import { useSettingsTeamMemberActivityLogs } from "@/services/queries/settings.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";

type UserActivityRow = {
  id: string;
  logId: string;
  action: string;
  actionDate: string;
  actionTimestamp: string;
};

const PAGE_SIZE = 5;

export function UserActivityLogPanel({ memberId }: { memberId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: activityResponse, isLoading } = useSettingsTeamMemberActivityLogs(
    memberId,
    listQuery,
  );
  const activities = activityResponse?.data ?? [];
  const paginationMeta = activityResponse?.pagination;

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: paginationMeta,
  });

  const rows: UserActivityRow[] = activities.map((a) => ({
    id: a.logId,
    logId: a.logId,
    action: a.event,
    actionDate: formatDate(a.createdAt, "dd/MM/yyyy"),
    actionTimestamp: formatDate(a.createdAt, "h:mm a"),
  }));

  const activeActivity =
    activeLogId != null ? (activities.find((a) => a.logId === activeLogId) ?? null) : null;

  const columns: ColumnDef<UserActivityRow, unknown>[] = [
    createSerialColumn<UserActivityRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<UserActivityRow>("Log ID", "logId"),
    createTextColumn<UserActivityRow>("Action", "action"),
    createTextColumn<UserActivityRow>("Action Date", "actionDate"),
    createTextColumn<UserActivityRow>("Action Timestamp", "actionTimestamp"),
    createActionColumnWithOptions<UserActivityRow>({
      ariaLabel: "View user activity log details",
      onView: (row) => {
        setActiveLogId(row.logId);
      },
    }),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TableSearchField placeholder="Search Activity ID" className="max-w-md" />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
          >
            Filter Options
            <ChevronDown className="h-4 w-4 text-text-grey" />
          </Button>
        </div>
      </div>

      <DataTable<UserActivityRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No activity logs found."
        pagination={{
          totalEntries: paginationMeta?.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeActivity ? (
        <UserActivityDetailsModal
          open={Boolean(activeActivity)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveLogId(null);
            }
          }}
          activity={activeActivity}
        />
      ) : null}
    </div>
  );
}
