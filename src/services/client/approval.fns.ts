import {
  isApprovalStatus,
  type ApprovalType,
  type ApprovalsResponseType,
} from "@/types/approval.type";
import apiHandler from "../api-handler";
import ApprovalRoute from "../route/approval.route";

function normalizeApproval(approval: ApprovalType): ApprovalType {
  const status = typeof approval.status === "string" ? approval.status.trim().toLowerCase() : "";

  return {
    ...approval,
    method: typeof approval.method === "string" ? approval.method.trim().toUpperCase() : "",
    status: isApprovalStatus(status) ? status : "unknown",
    checker: approval.checker ?? "",
    maker: approval.maker ?? "",
    unit: approval.unit ?? "",
  };
}

export const fetchApprovals = async (query: string = "") => {
  const { data } = await apiHandler.get<ApprovalsResponseType>(
    `${ApprovalRoute.approvals}${query ? `?${query}` : ""}`,
  );

  return {
    ...data,
    data: (data.data ?? []).map(normalizeApproval),
  };
};
