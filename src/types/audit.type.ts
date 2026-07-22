import { PaginatedApiResponse } from "./global";

export type AuditLogType = {
  logId: string;
  message: string;
  status: string;
  event: string;
  eventTag: string;
  resource: string;
  ip: string;
  maker: string;
  userId: string;
  initiatorName: string;
  createdAt: string;
};

export type AuditLogsResponseType = PaginatedApiResponse<AuditLogType[]>;
