"use client";

import type { LoanCaseStatus } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";

export type SmartContractStatus = LoanCaseStatus;

export type SmartContractRecord = {
  id: string;
  loanId: string;
  borrowerName: string;
  borrowerRiskCreditScorePercent: number;
  principalAmount: number;
  durationLabel: string;
  proposedInterestLabel: string;
  repaymentAmount: number;
  disbursedDateLabel: string;
  repaymentDueLabel: string;
  collateralSymbol: string;
  collateralName: string;
  collateralMarketPrice: number;
  collateralTrendLabel: string;
  contractAddress: string;
  contractVerified: boolean;
  lockedCollateralValue: number;
  lockedCollateralQuantityLabel: string;
  ltvPercent: number;
  liquidationThresholdPercent: number;
  liquidationThresholdAmount: number;
  currentCollateralValue: number;
  status: SmartContractStatus;
  rejectionReason?: string;
};
