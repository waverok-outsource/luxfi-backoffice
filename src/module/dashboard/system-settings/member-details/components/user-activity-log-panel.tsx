"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown, Search } from "lucide-react";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
  createTextColumn,
} from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  UserActivityDetailsModal,
  type TeamMemberUserActivityRecord,
} from "@/module/dashboard/system-settings/member-details/components/user-activity-details-modal";

type UserActivityRow = Pick<
  TeamMemberUserActivityRecord,
  "id" | "activityId" | "action" | "actionDate" | "actionTimestamp"
>;

const PAGE_SIZE = 5;

function generateUserActivityRows(
  memberId: string,
  memberName: string,
  memberRole: string,
): TeamMemberUserActivityRecord[] {
  const activities = [
    "Loan Approved",
    "Loan Rejected",
    "Loan Approved",
    "Loan Disbursed",
    "Loan Disbursed",
  ] as const;

  return Array.from({ length: 1000 }, (_, index) => {
    const item = activities[index % activities.length] ?? activities[0];
    const day = (index % 20) + 1;

    return {
      id: `${memberId}-activity-${index + 1}`,
      activityId: `CU-${String(8890955422 + index + 1)}...`,
      action: item,
      actionDate: format(new Date(2026, 1, day), "dd/MM/yyyy"),
      actionDateLabel: format(new Date(2026, 0, day), "do MMMM, yyyy"),
      actionTimestamp: "10:23 AM",
      initiatorId: `0000${String(85752257 + index).padStart(8, "0")}`,
      initiatorName: memberName,
      initiatorRole: memberRole,
    };
  });
}

export function UserActivityLogPanel({
  memberId,
  memberName,
  memberRole,
}: {
  memberId: string;
  memberName: string;
  memberRole: string;
}) {
  const { value, setURLQuery } = useURLQuery<{ page?: string; search?: string }>();
  const [activeActivityId, setActiveActivityId] = React.useState<string | null>(null);
  const activities = React.useMemo(
    () => generateUserActivityRows(memberId, memberName, memberRole),
    [memberId, memberName, memberRole],
  );

  const searchQuery = (value.search ?? "").trim().toLowerCase();
  const filteredActivities = React.useMemo(() => {
    if (!searchQuery) {
      return activities;
    }

    return activities.filter(
      (row) =>
        row.activityId.toLowerCase().includes(searchQuery) ||
        row.action.toLowerCase().includes(searchQuery) ||
        row.initiatorName.toLowerCase().includes(searchQuery),
    );
  }, [activities, searchQuery]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<UserActivityRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredActivities.slice(start, start + PAGE_SIZE).map((activity) => ({
      id: activity.id,
      activityId: activity.activityId,
      action: activity.action,
      actionDate: activity.actionDate,
      actionTimestamp: activity.actionTimestamp,
    }));
  }, [currentPage, filteredActivities]);

  const activeActivity =
    activeActivityId != null
      ? activities.find((activity) => activity.id === activeActivityId) ?? null
      : null;

  const columns = React.useMemo<ColumnDef<UserActivityRow, unknown>[]>(
    () => [
      createSerialColumn<UserActivityRow>(),
      createIdentifierColumn<UserActivityRow>("Log ID", "activityId"),
      createTextColumn<UserActivityRow>("Action", "action"),
      createTextColumn<UserActivityRow>("Action Date", "actionDate"),
      createTextColumn<UserActivityRow>("Action Timestamp", "actionTimestamp"),
      createActionColumnWithOptions<UserActivityRow>({
        ariaLabel: "View user activity log details",
        onView: (row) => {
          setActiveActivityId(row.id);
        },
      }),
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search Activity ID"
            value={value.search ?? ""}
            onChange={(event) =>
              setURLQuery({
                search: event.target.value || undefined,
                page: "1",
              })
            }
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
        </div>
      </div>

      <DataTable<UserActivityRow, unknown>
        columns={columns}
        data={rows}
        enableCheckbox
        pagination={{
          totalEntries: filteredActivities.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeActivity ? (
        <UserActivityDetailsModal
          open={Boolean(activeActivity)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveActivityId(null);
            }
          }}
          activity={activeActivity}
        />
      ) : null}
    </div>
  );
}
