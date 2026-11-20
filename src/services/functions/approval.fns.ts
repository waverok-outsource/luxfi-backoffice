import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Method } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/config";
import { fetchApproval } from "@/services/client/approval.fns";
import apiHandler from "@/services/api-handler";
import ApprovalRoute from "@/services/route/approval.route";
import { isApprovalHttpMethod, type ApprovalReplay } from "@/types/approval.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

function resolveApprovalRequestPath(target: string) {
  const trimmed = target.trim();

  if (!trimmed) {
    throw new Error("This approval does not include a request to send.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = new URL(trimmed);
    const apiBase = API_URL ? new URL(API_URL) : null;

    if (!apiBase || parsed.origin !== apiBase.origin) {
      throw new Error("Approvals can only be sent to the application API.");
    }

    return `${parsed.pathname}${parsed.search}`;
  }

  if (trimmed.startsWith("//") || trimmed.includes("://")) {
    throw new Error("This approval has an invalid request path.");
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function replayRequest(approvalId: string, replay: ApprovalReplay) {
  const method = replay.method.trim().toUpperCase();

  if (!isApprovalHttpMethod(method)) {
    throw new Error("This approval uses an unsupported request method.");
  }

  const params: Record<string, unknown> = { ...replay.query };
  delete params.approval_id;
  params.approval_id = approvalId;

  return apiHandler.request({
    method: method as Method,
    url: resolveApprovalRequestPath(replay.path),
    params,
    ...(method === "GET" ? {} : { data: replay.body ?? {} }),
  });
}

function requireReason(reason: string) {
  const trimmed = reason.trim();

  if (trimmed.length < 3) {
    throw new Error("Enter a reason of at least 3 characters.");
  }

  if (trimmed.length > 500) {
    throw new Error("Use 500 characters or fewer.");
  }

  return trimmed;
}

const useApprovalFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    APPROVE: false,
    REJECT: false,
    CANCEL: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const runAction = async (
    state: keyof typeof loading,
    task: () => Promise<void>,
    callback?: () => void,
  ) => {
    loadingFn(state, true);

    try {
      await task();
      await queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all });
      callback?.();
    } catch (error: unknown) {
      await queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all });
      toast.error(getErrorMessage(error));
    } finally {
      loadingFn(state, false);
    }
  };

  const fns = {
    approveRequest: (approvalId: string, callback?: () => void) =>
      runAction(
        "APPROVE",
        async () => {
          const approval = await fetchApproval(approvalId);

          if (approval.status !== "pending") {
            throw new Error("Only pending approvals can be approved.");
          }

          if (!approval.replay) {
            throw new Error("This approval does not include a request to send.");
          }

          await replayRequest(approval.approvalId, approval.replay);
        },
        callback,
      ),

    rejectRequest: (approvalId: string, reason: string, callback?: () => void) =>
      runAction(
        "REJECT",
        async () => {
          await apiHandler.post(ApprovalRoute.reject(approvalId), { reason: requireReason(reason) });
        },
        callback,
      ),

    cancelRequest: (approvalId: string, reason: string, callback?: () => void) =>
      runAction(
        "CANCEL",
        async () => {
          await apiHandler.post(ApprovalRoute.cancel(approvalId), { reason: requireReason(reason) });
        },
        callback,
      ),
  };

  return { ...fns, loading };
};

export default useApprovalFns;
