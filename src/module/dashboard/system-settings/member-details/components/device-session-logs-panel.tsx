"use client";

import { useURLQuery } from "@/hooks/useUrlQuery";
import {
  DeviceSessionLogsPanel as SharedDeviceSessionLogsPanel,
  type SessionLogModalData,
} from "@/module/dashboard/shared/components/device-session-logs-panel";
import { useSettingsTeamMemberSessionLogs } from "@/services/queries/settings.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, formatSessionLogLocation } from "@/util/helper";

const PAGE_SIZE = 5;

export function DeviceSessionLogsPanel({ memberId }: { memberId: string }) {
  const { value } = useURLQuery<{ page?: string; q?: string }>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const query = (value.q ?? "").trim();

  const listQuery = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(query ? { q: query } : {}),
  });

  const { data: sessionResponse, isLoading } = useSettingsTeamMemberSessionLogs(
    memberId,
    listQuery,
  );
  const sessions = sessionResponse?.data ?? [];

  return (
    <SharedDeviceSessionLogsPanel
      sessions={sessions}
      isLoading={isLoading}
      pagination={sessionResponse?.pagination}
      viewAriaLabel="View device session log details"
      mapRow={(session) => ({
        id: session.sessionLogId,
        sessionLogId: session.sessionLogId,
        deviceName: session.device,
        channel: session.channel,
        ipAddress: session.ipAddress,
        userLocation: formatSessionLogLocation(session.location),
        activity: session.activity,
        sessionDate: formatDate(session.createdAt, "dd/MM/yyyy"),
        timestamp: formatDate(session.createdAt, "h:mm a"),
      })}
      mapModalData={(session): SessionLogModalData => ({
        sessionLogId: session.sessionLogId,
        deviceName: session.device,
        deviceModel: session.deviceModel,
        channel: session.channel,
        dateLabel: formatDate(session.createdAt, "do MMMM, yyyy"),
        timestampLabel: formatDate(session.createdAt, "h:mm a"),
        locationLabel: formatSessionLogLocation(session.location),
        ipAddress: session.ipAddress,
      })}
    />
  );
}
