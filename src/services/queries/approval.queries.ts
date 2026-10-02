import { useQuery } from "@tanstack/react-query";

import { fetchApprovals } from "@/services/client/approval.fns";
import keyFactory from "@/util/query-key-factory";

export const useApprovals = (query: string) =>
  useQuery({
    queryKey: keyFactory.approvals.list(query),
    queryFn: () => fetchApprovals(query),
  });
