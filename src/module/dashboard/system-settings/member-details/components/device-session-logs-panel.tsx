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
  SessionLogReportModal,
  type TeamMemberSessionLogRecord,
} from "@/module/dashboard/system-settings/member-details/components/session-log-report-modal";

type DeviceSessionRow = Pick<
  TeamMemberSessionLogRecord,
  | "id"
  | "sessionId"
  | "deviceName"
  | "channel"
  | "ipAddress"
  | "userLocation"
  | "activity"
  | "sessionDate"
  | "timestamp"
>;

const PAGE_SIZE = 5;

function generateDeviceSessionRows(memberId: string): TeamMemberSessionLogRecord[] {
  const devices = [
    { deviceName: "Iphone 17 Pro max", channel: "Mobile", activity: "User Logged in" },
    { deviceName: "Mac Book Safari", channel: "Web", activity: "User Logged in" },
    { deviceName: "Iphone 17 Pro max", channel: "Mobile", activity: "User Logged out" },
    { deviceName: "Mac Book Safari", channel: "Web", activity: "User Logged in" },
    { deviceName: "Iphone 17 Pro max", channel: "Mobile", activity: "User Logged in" },
  ] as const;

  return Array.from({ length: 1000 }, (_, index) => {
    const device = devices[index % devices.length] ?? devices[0];
    const day = (index % 20) + 1;

    return {
      id: `${memberId}-device-${index + 1}`,
      sessionId: `0000${String(85752257 + index).padStart(8, "0")}`,
      deviceName: device.deviceName,
      channel: device.channel,
      ipAddress: "142.096.02.01",
      userLocation: "Lagos, Nigeria",
      activity: device.activity,
      sessionDate: format(new Date(2026, 0, day), "dd/MM/yyyy"),
      dateLabel: format(new Date(2026, 0, day), "do MMMM, yyyy"),
      timestamp: index % 2 === 0 ? "07:20 AM" : "10:30:00pm",
    };
  });
}

export function DeviceSessionLogsPanel({ memberId }: { memberId: string }) {
  const { value, setURLQuery } = useURLQuery<{ page?: string; search?: string }>();
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const sessions = React.useMemo(() => generateDeviceSessionRows(memberId), [memberId]);

  const searchQuery = (value.search ?? "").trim().toLowerCase();
  const filteredSessions = React.useMemo(() => {
    if (!searchQuery) {
      return sessions;
    }

    return sessions.filter(
      (row) =>
        row.sessionId.toLowerCase().includes(searchQuery) ||
        row.deviceName.toLowerCase().includes(searchQuery) ||
        row.ipAddress.toLowerCase().includes(searchQuery),
    );
  }, [searchQuery, sessions]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<DeviceSessionRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE).map((session) => ({
      id: session.id,
      sessionId: session.sessionId,
      deviceName: session.deviceName,
      channel: session.channel,
      ipAddress: session.ipAddress,
      userLocation: session.userLocation,
      activity: session.activity,
      sessionDate: session.sessionDate,
      timestamp: session.timestamp,
    }));
  }, [currentPage, filteredSessions]);

  const activeSession =
    activeSessionId != null ? sessions.find((session) => session.id === activeSessionId) ?? null : null;

  const columns = React.useMemo<ColumnDef<DeviceSessionRow, unknown>[]>(
    () => [
      createSerialColumn<DeviceSessionRow>(),
      createIdentifierColumn<DeviceSessionRow>("Session ID", "sessionId"),
      createTextColumn<DeviceSessionRow>("Device Name", "deviceName"),
      createTextColumn<DeviceSessionRow>("Channel", "channel"),
      createTextColumn<DeviceSessionRow>("IP Address", "ipAddress"),
      createTextColumn<DeviceSessionRow>("User Location", "userLocation"),
      createTextColumn<DeviceSessionRow>("Activity", "activity"),
      createTextColumn<DeviceSessionRow>("Session Date", "sessionDate"),
      createTextColumn<DeviceSessionRow>("Time stamp", "timestamp"),
      createActionColumnWithOptions<DeviceSessionRow>({
        ariaLabel: "View device session log details",
        onView: (row) => {
          setActiveSessionId(row.id);
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
        enableCheckbox
        pagination={{
          totalEntries: filteredSessions.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeSession ? (
        <SessionLogReportModal
          open={Boolean(activeSession)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveSessionId(null);
            }
          }}
          session={activeSession}
        />
      ) : null}
    </div>
  );
}
