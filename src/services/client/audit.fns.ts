import type { AuditLogsResponseType } from "@/types/audit.type";
import apiHandler from "../api-handler";
import AuditRoute from "../route/audit.route";

export const fetchAuditLogs = async (resource: string, query: string = "") => {
  const { data } = await apiHandler.get<AuditLogsResponseType>(
    `${AuditRoute.audits}?resource=${encodeURIComponent(resource)}${query ? `&${query}` : ""}`,
  );

  return data;
};
