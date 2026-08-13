"use client";

import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  DeviceSessionLogsPanel as SharedDeviceSessionLogsPanel,
  type SessionLogModalData,
} from "@/module/dashboard/shared/components/device-session-logs-panel";
import { useCustomerSessionLogs } from "@/services/queries/customer.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate } from "@/util/helper";

const PAGE_SIZE = 5;

export function DeviceSessionLogsPanel({ customerId }: { customerId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: sessionResponse, isLoading } = useCustomerSessionLogs(customerId, listQuery);
  const sessions = sessionResponse?.data ?? [];

  return (
    <SharedDeviceSessionLogsPanel
      sessions={sessions}
      isLoading={isLoading}
      pagination={sessionResponse?.pagination}
      mapRow={(session) => ({
        id: session.sessionLogId,
        sessionLogId: session.sessionLogId,
        deviceName: session.deviceName,
        channel: session.channel,
        ipAddress: session.ipAddress,
        userLocation: session.userLocation,
        activity: session.activity,
        sessionDate: session.sessionDate,
        timestamp: session.timestamp,
      })}
      mapModalData={(session): SessionLogModalData => ({
        sessionLogId: session.sessionLogId,
        deviceName: session.deviceName,
        channel: session.channel,
        dateLabel: formatDate(session.createdAt, "do MMMM, yyyy"),
        timestampLabel: session.timestamp,
        locationLabel: session.userLocation,
        ipAddress: session.ipAddress,
      })}
    />
  );
}
