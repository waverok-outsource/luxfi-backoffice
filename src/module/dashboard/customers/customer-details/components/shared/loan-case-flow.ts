"use client";

export type LoanCaseFlowStep = "INFO" | "REJECT" | "APPROVE_CONFIRM" | "RESULT";

export type LoanCaseApprovalPayload = {
  loanId: string;
  liquidationThresholdAmount: number;
  disbursedDateLabel: string;
  repaymentDueLabel: string;
};
