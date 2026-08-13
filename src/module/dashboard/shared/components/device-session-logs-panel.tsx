"use client";

import * as React from "react";
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
import { SessionLogReportModal, type SessionLogModalData } from "@/module/dashboard/shared/components/session-log-report-modal";
import { getSerialNumberOffset } from "@/util/helper";

export type { SessionLogModalData };

const PAGE_SIZE = 5;

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

type DeviceSessionLogsPanelProps<TSession extends { sessionLogId: string }> = {
  sessions: TSession[];
  isLoading: boolean;
  pagination?: { total?: number; offset?: number | null; perPage?: number | null } | null;
  mapRow: (session: TSession) => DeviceSessionRow;
  mapModalData: (session: TSession) => SessionLogModalData;
  viewAriaLabel?: string;
};

export function DeviceSessionLogsPanel<TSession extends { sessionLogId: string }>({
  sessions,
  isLoading,
  pagination,
  mapRow,
  mapModalData,
  viewAriaLabel = "View device session log report",
}: DeviceSessionLogsPanelProps<TSession>) {
  const { value } = useURLQuery<{ page?: string }>();
  const [activeSessionLogId, setActiveSessionLogId] = React.useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination,
  });

  const rows = React.useMemo(() => sessions.map(mapRow), [sessions, mapRow]);

  const activeSession =
    activeSessionLogId != null
      ? (sessions.find((session) => session.sessionLogId === activeSessionLogId) ?? null)
      : null;

  const columns = React.useMemo<ColumnDef<DeviceSessionRow, unknown>[]>(
    () => [
      createSerialColumn<DeviceSessionRow>({ offset: serialNumberOffset }),
      createIdentifierColumn<DeviceSessionRow>("Session ID", "sessionLogId", "max-w-[7rem]"),
      createTextColumn<DeviceSessionRow>(
        "Device Name",
        "deviceName",
        "inline-block max-w-[6rem]",
      ),
      createTextColumn<DeviceSessionRow>("Channel", "channel"),
      createTextColumn<DeviceSessionRow>("IP Address", "ipAddress"),
      createTextColumn<DeviceSessionRow>("User Location", "userLocation"),
      createTextColumn<DeviceSessionRow>("Activity", "activity", "inline-block max-w-[7rem]"),
      createTextColumn<DeviceSessionRow>("Session Date", "sessionDate"),
      createTextColumn<DeviceSessionRow>("Time stamp", "timestamp"),
      createActionColumnWithOptions<DeviceSessionRow>({
        ariaLabel: viewAriaLabel,
        onView: (row) => {
          setActiveSessionLogId(row.sessionLogId);
        },
      }),
    ],
    [serialNumberOffset, viewAriaLabel],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TableSearchField placeholder="Search Session ID" className="max-w-md" />

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
          totalEntries: pagination?.total ?? 0,
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
          session={mapModalData(activeSession)}
        />
      ) : null}
    </div>
  );
}
