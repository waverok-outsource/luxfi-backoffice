"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown, Search } from "lucide-react";

import {
  createActionColumnWithOptions,
  createIdentifierColumn,
  createSerialColumn,
} from "@/components/table";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { DeviceSessionLogModal } from "@/module/dashboard/customers/customer-details/components/sessions/device-session-log-modal";
import type {
  DeviceSessionActivity,
  DeviceSessionChannel,
  DeviceSessionRecord,
} from "@/module/dashboard/customers/customer-details/components/sessions/device-session-log-types";

type DeviceSessionRow = Pick<
  DeviceSessionRecord,
  | "id"
  | "sessionId"
  | "deviceName"
  | "channel"
  | "ipAddress"
  | "userLocation"
  | "activity"
  | "sessionDateLabel"
  | "timestampLabel"
>;

const PAGE_SIZE = 5;

function generateDeviceSessions(total: number): DeviceSessionRecord[] {
  const devices = [
    { deviceName: "Iphone 17 Pro max", channel: "Mobile" as DeviceSessionChannel },
    { deviceName: "Mac Book Safari", channel: "Web" as DeviceSessionChannel },
    { deviceName: "Iphone 17 Pro max", channel: "Mobile" as DeviceSessionChannel },
    { deviceName: "Mac Book Safari", channel: "Web" as DeviceSessionChannel },
    { deviceName: "Iphone 17 Pro max", channel: "Mobile" as DeviceSessionChannel },
  ] as const;
  const activities: DeviceSessionActivity[] = [
    "User Logged in",
    "User Logged in",
    "User Logged out",
    "User Logged in",
    "User Logged in",
  ];

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const device = devices[index % devices.length] ?? devices[0];
    const activity = activities[index % activities.length] ?? "User Logged in";
    const dayNumber = (index % 20) + 1;
    const day = String(dayNumber).padStart(2, "0");

    return {
      id: `session-${serial}`,
      sessionId: `CU-${String(8890955422 + serial)}...`,
      deviceName: device.deviceName,
      channel: device.channel,
      ipAddress: "142.096.02.01",
      userLocation: "Lagos, Nigeria",
      activity,
      sessionDateLabel: `${day}/01/2026`,
      timestampLabel: index % 2 === 0 ? "10:30:00pm" : "07:20:00am",
      dateLabel: format(new Date(2026, 0, dayNumber), "do MMMM, yyyy"),
    };
  });
}

export function DeviceSessionLogsPanel() {
  const { value, setURLQuery } = useURLQuery<{ page?: string; search?: string }>();
  const [sessions] = React.useState<DeviceSessionRecord[]>(() => generateDeviceSessions(1000));
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const searchQuery = (value.search ?? "").trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!searchQuery) return sessions;
    return sessions.filter(
      (session) =>
        session.sessionId.toLowerCase().includes(searchQuery) ||
        session.deviceName.toLowerCase().includes(searchQuery) ||
        session.ipAddress.toLowerCase().includes(searchQuery),
    );
  }, [searchQuery, sessions]);

  const parsedPage = Number(value.page);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;

  const rows = React.useMemo<DeviceSessionRow[]>(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map((session) => ({
      id: session.id,
      sessionId: session.sessionId,
      deviceName: session.deviceName,
      channel: session.channel,
      ipAddress: session.ipAddress,
      userLocation: session.userLocation,
      activity: session.activity,
      sessionDateLabel: session.sessionDateLabel,
      timestampLabel: session.timestampLabel,
    }));
  }, [currentPage, filtered]);

  const activeSession = activeSessionId
    ? (sessions.find((session) => session.id === activeSessionId) ?? null)
    : null;

  const columns: ColumnDef<DeviceSessionRow, unknown>[] = [
    createSerialColumn<DeviceSessionRow>(),
    createIdentifierColumn<DeviceSessionRow>("Session ID", "sessionId"),
    {
      accessorKey: "deviceName",
      header: "Device Name",
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "userLocation",
      header: "User Location",
    },
    {
      accessorKey: "activity",
      header: "Activity",
    },
    {
      accessorKey: "sessionDateLabel",
      header: "Session Date",
    },
    {
      accessorKey: "timestampLabel",
      header: "Time stamp",
    },
    createActionColumnWithOptions<DeviceSessionRow>({
      ariaLabel: "View device session log report",
      onView: (row) => {
        setActiveSessionId(row.id);
        setModalOpen(true);
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
        enableCheckbox
        pagination={{
          totalEntries: filtered.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeSession ? (
        <DeviceSessionLogModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setActiveSessionId(null);
          }}
          session={activeSession}
        />
      ) : null}
    </div>
  );
}
