import { useQuery } from "@tanstack/react-query";

import { fetchApproval, fetchApprovals } from "@/services/client/approval.fns";
import type { ApprovalListScope } from "@/types/approval.type";
import keyFactory from "@/util/query-key-factory";

export const useApprovals = (scope: ApprovalListScope, query: string) =>
  useQuery({
    queryKey: keyFactory.approvals.list(scope, query),
    queryFn: () => fetchApprovals(scope, query),
  });

export const useApproval = (approvalId: string, enabled = true) =>
  useQuery({
    queryKey: keyFactory.approvals.detail(approvalId),
    queryFn: () => fetchApproval(approvalId),
    enabled: enabled && Boolean(approvalId),
  });
