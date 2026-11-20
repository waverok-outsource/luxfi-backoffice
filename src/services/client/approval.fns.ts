import type { ApiResponse, PaginatedApiResponse } from "@/types/global";
import {
  isApprovalStatus,
  type ApprovalHistoryEvent,
  type ApprovalListScope,
  type ApprovalReplay,
  type ApprovalType,
  type ApprovalsResponseType,
} from "@/types/approval.type";
import apiHandler from "../api-handler";
import ApprovalRoute from "../route/approval.route";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asId(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (isRecord(value)) {
    if (typeof value.$oid === "string") {
      return value.$oid.trim();
    }

    if ("_id" in value) {
      return asId(value._id);
    }
  }

  return "";
}

function normalizeHistory(value: unknown): ApprovalHistoryEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const action = asText(item.action);
    if (!action) {
      return [];
    }

    return [
      {
        action,
        actorId: asId(item.actorId),
        actorName: asText(item.actorName),
        note: asText(item.note),
        at: asText(item.at),
      },
    ];
  });
}

function normalizeReplay(raw: Record<string, unknown>, approvalId: string): ApprovalReplay | undefined {
  const source = isRecord(raw.replay) ? raw.replay : raw;
  const method = asText(source.method).toUpperCase();
  const path = asText(source.path) || asText(source.url) || asText(raw.path) || asText(raw.url);

  if (!method || !path) {
    return undefined;
  }

  const querySource = isRecord(source.query) ? source.query : isRecord(raw.query) ? raw.query : {};
  const query: Record<string, unknown> = { ...querySource };
  if (approvalId) {
    query.approval_id = approvalId;
  }

  const body = "body" in source ? source.body : raw.body;

  return {
    method,
    path,
    query,
    body: body ?? {},
  };
}

export function normalizeApproval(value: unknown): ApprovalType {
  const raw = isRecord(value) ? value : {};
  const approvalId = asId(raw._id) || asId(raw.approvalId) || asId(raw.id);
  const status = asText(raw.status).toLowerCase();
  const hasStoredRequest = isRecord(raw.replay) || "body" in raw || "query" in raw;

  return {
    approvalId,
    description: asText(raw.description),
    status: isApprovalStatus(status) ? status : "unknown",
    makerId: asId(raw.makerId),
    maker: asText(raw.makerName) || asText(raw.maker),
    checkerId: asId(raw.checkerId),
    checker: asText(raw.checkerName) || asText(raw.checker),
    unit: asText(raw.unit),
    permission: asText(raw.permission),
    createdAt: asText(raw.createdAt),
    updatedAt: asText(raw.updatedAt),
    expiresAt: asText(raw.expiresAt),
    checkedAt: asText(raw.checkedAt),
    executedAt: asText(raw.executedAt),
    executionError: asText(raw.executionError),
    executionStatusCode:
      typeof raw.executionStatusCode === "number" ? raw.executionStatusCode : undefined,
    rejectionReason: asText(raw.rejectionReason),
    history: normalizeHistory(raw.history),
    replay: hasStoredRequest ? normalizeReplay(raw, approvalId) : undefined,
    canCheck: raw.canCheck === true,
  };
}

export const fetchApprovals = async (scope: ApprovalListScope, query: string = "") => {
  const path = scope === "mine" ? ApprovalRoute.mine : ApprovalRoute.approvals;
  const { data } = await apiHandler.get<PaginatedApiResponse<unknown[]>>(
    `${path}${query ? `?${query}` : ""}`,
  );

  const response: ApprovalsResponseType = {
    ...data,
    data: (data.data ?? []).map(normalizeApproval),
  };

  return response;
};

export const fetchApproval = async (approvalId: string) => {
  const { data } = await apiHandler.get<ApiResponse<unknown>>(ApprovalRoute.detail(approvalId));
  return normalizeApproval(data.data);
};
