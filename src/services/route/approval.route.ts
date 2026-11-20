const baseUrl = "/v1/approvals";

const ApprovalRoute = {
  approvals: baseUrl,
  mine: `${baseUrl}/mine`,
  detail: (approvalId: string) => `${baseUrl}/${encodeURIComponent(approvalId)}`,
  reject: (approvalId: string) => `${baseUrl}/${encodeURIComponent(approvalId)}/reject`,
  cancel: (approvalId: string) => `${baseUrl}/${encodeURIComponent(approvalId)}/cancel`,
};

export default ApprovalRoute;
