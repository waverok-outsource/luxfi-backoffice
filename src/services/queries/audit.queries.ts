import { useQuery } from "@tanstack/react-query";

import { fetchAuditLogs } from "@/services/client/audit.fns";
import keyFactory from "@/util/query-key-factory";

export const useAuditLogs = (resource: string, query: string) =>
  useQuery({
    queryKey: keyFactory.audits.list(resource, query),
    queryFn: () => fetchAuditLogs(resource, query),
    enabled: Boolean(resource),
  });
