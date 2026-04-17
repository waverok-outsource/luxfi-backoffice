"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
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
import { SessionLogReportModal } from "@/module/dashboard/system-settings/member-details/components/session-log-report-modal";
import { useSettingsTeamMemberSessionLogs } from "@/services/queries/settings.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, formatSessionLogLocation, getSerialNumberOffset } from "@/util/helper";

type DeviceSessionRow = {
  id: string;
  sessionLogId: string;
  deviceName: string;
  channel: string;
  ipAddress: string;
  userLocation: string;
  activity: string;
  sessionDate: string;
  timestamp: string;
};

const PAGE_SIZE = 5;

export function DeviceSessionLogsPanel({ memberId }: { memberId: string }) {
  const { value, setURLQuery } = useURLQuery<{ page?: string; search?: string }>();
  const [activeSessionLogId, setActiveSessionLogId] = useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.search ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { search } : {}),
  });

  const { data: sessionResponse, isLoading } = useSettingsTeamMemberSessionLogs(
    memberId,
    listQuery,
  );
  const sessions = sessionResponse?.data ?? [];
  const paginationMeta = sessionResponse?.pagination;

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: paginationMeta,
  });

  const rows: DeviceSessionRow[] = sessions.map((s) => ({
    id: s.sessionLogId,
    sessionLogId: s.sessionLogId,
    deviceName: s.device,
    channel: s.channel,
    ipAddress: s.ipAddress,
    userLocation: formatSessionLogLocation(s.location),
    activity: s.activity,
    sessionDate: formatDate(s.createdAt, "dd/MM/yyyy"),
    timestamp: formatDate(s.createdAt, "h:mm a"),
  }));

  const activeSession =
    activeSessionLogId != null
      ? (sessions.find((s) => s.sessionLogId === activeSessionLogId) ?? null)
      : null;

  const columns: ColumnDef<DeviceSessionRow, unknown>[] = [
    createSerialColumn<DeviceSessionRow>({ offset: serialNumberOffset }),
    createIdentifierColumn<DeviceSessionRow>("Session ID", "sessionLogId", "max-w-[7rem]"),
    createTextColumn<DeviceSessionRow>("Device Name", "deviceName", "inline-block max-w-[6rem]"),
    createTextColumn<DeviceSessionRow>("Channel", "channel"),
    createTextColumn<DeviceSessionRow>("IP Address", "ipAddress"),
    createTextColumn<DeviceSessionRow>("User Location", "userLocation"),
    createTextColumn<DeviceSessionRow>("Activity", "activity", "inline-block max-w-[7rem]"),
    createTextColumn<DeviceSessionRow>("Session Date", "sessionDate"),
    createTextColumn<DeviceSessionRow>("Time stamp", "timestamp"),
    createActionColumnWithOptions<DeviceSessionRow>({
      ariaLabel: "View device session log details",
      onView: (row) => {
        setActiveSessionLogId(row.sessionLogId);
      },
    }),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search Session ID"
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

      <DataTable<DeviceSessionRow, unknown>
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No session logs found."
        pagination={{
          totalEntries: paginationMeta?.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeSession ? (
        <SessionLogReportModal
          open={Boolean(activeSession)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveSessionLogId(null);
            }
          }}
          session={activeSession}
        />
      ) : null}
    </div>
  );
}
