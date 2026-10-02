import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Method } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/config";
import apiHandler from "@/services/api-handler";
import {
  getApprovalRequestTarget,
  isApprovalHttpMethod,
  type ApprovalType,
} from "@/types/approval.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveApprovalRequestPath(target: string) {
  const trimmed = target.trim();

  if (!trimmed) {
    throw new Error("This approval does not include a request path.");
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

const useApprovalFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    APPROVE: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    approveRequest: async (approval: ApprovalType, callback?: () => void) => {
      loadingFn("APPROVE", true);

      try {
        const method = approval.method.trim().toUpperCase();

        if (!isApprovalHttpMethod(method)) {
          throw new Error("This approval uses an unsupported request method.");
        }

        if (approval.status !== "pending") {
          throw new Error("Only pending approvals can be approved.");
        }

        const url = resolveApprovalRequestPath(getApprovalRequestTarget(approval));
        const hasPayload = approval.payload !== undefined && approval.payload !== null;

        await apiHandler.request({
          method: method as Method,
          url,
          ...(method === "GET" && isRecord(approval.payload)
            ? { params: approval.payload }
            : hasPayload
              ? { data: approval.payload }
              : {}),
        });

        await queryClient.invalidateQueries({ queryKey: keyFactory.approvals.all });
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("APPROVE", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useApprovalFns;
