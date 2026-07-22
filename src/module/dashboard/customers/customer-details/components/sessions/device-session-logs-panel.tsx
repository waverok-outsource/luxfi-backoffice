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
import { DeviceSessionLogModal } from "@/module/dashboard/customers/customer-details/components/sessions/device-session-log-modal";
import { useCustomerSessionLogs } from "@/services/queries/customer.queries";
import type { CustomerSessionLogType } from "@/types/customer.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { getSerialNumberOffset } from "@/util/helper";

const PAGE_SIZE = 5;

export function DeviceSessionLogsPanel({ customerId }: { customerId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const [activeSessionLogId, setActiveSessionLogId] = React.useState<string | null>(null);

  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: sessionResponse, isLoading } = useCustomerSessionLogs(customerId, listQuery);
  const sessions = sessionResponse?.data ?? [];
  const paginationMeta = sessionResponse?.pagination;

  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: paginationMeta,
  });

  const activeSession =
    activeSessionLogId != null
      ? (sessions.find((session) => session.sessionLogId === activeSessionLogId) ?? null)
      : null;

  const columns: ColumnDef<CustomerSessionLogType, unknown>[] = [
    createSerialColumn<CustomerSessionLogType>({ offset: serialNumberOffset }),
    createIdentifierColumn<CustomerSessionLogType>("Session ID", "sessionLogId", "max-w-[7rem]"),
    createTextColumn<CustomerSessionLogType>(
      "Device Name",
      "deviceName",
      "inline-block max-w-[6rem]",
    ),
    createTextColumn<CustomerSessionLogType>("Channel", "channel"),
    createTextColumn<CustomerSessionLogType>("IP Address", "ipAddress"),
    createTextColumn<CustomerSessionLogType>("User Location", "userLocation"),
    createTextColumn<CustomerSessionLogType>("Activity", "activity", "inline-block max-w-[7rem]"),
    createTextColumn<CustomerSessionLogType>("Session Date", "sessionDate"),
    createTextColumn<CustomerSessionLogType>("Time stamp", "timestamp"),
    createActionColumnWithOptions<CustomerSessionLogType>({
      ariaLabel: "View device session log report",
      onView: (row) => {
        setActiveSessionLogId(row.sessionLogId);
      },
    }),
  ];

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

      <DataTable<CustomerSessionLogType, unknown>
        columns={columns}
        data={sessions}
        loading={isLoading}
        emptyStateLabel="No session logs found."
        pagination={{
          totalEntries: paginationMeta?.total ?? 0,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {activeSession ? (
        <DeviceSessionLogModal
          open={Boolean(activeSession)}
          onOpenChange={(open) => {
            if (!open) setActiveSessionLogId(null);
          }}
          session={activeSession}
        />
      ) : null}
    </div>
  );
}
