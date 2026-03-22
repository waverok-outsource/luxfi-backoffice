import type { LoanCaseFlowStep } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-flow";

export type AssetPortfolioStatus = "pending" | "verified" | "rejected" | "notVerified";

export type AssetPortfolioRecord = {
  id: string;
  assetId: string;
  borrowerName: string;
  assetCategory: string;
  assetName: string;
  marketValue: number;
  pawnValue: number | null;
  dateAppliedLabel: string;
  marketTrendLabel: string;
  status: AssetPortfolioStatus;
  rejectionReason?: string;

  brandCategory: string;
  year: string;
  dialColour: string;
  weight: string;
  box: string;
  caseColour: string;
  caseSize: string;

  submittedDateLabel: string;
  examinationDateLabel: string;
  examinationOfficerEmail: string;
  physicalDefects: string;
  officerRemark: string;
  certificationPapers: boolean | null;
  boxPackaged: boolean | null;
};

export type AssetPortfolioStep = LoanCaseFlowStep;

export type AssetVerificationPayload = {
  assetId: string;
  pawnValue: number;
  submittedDateLabel: string;
  examinationDateLabel: string;
  examinationOfficerEmail: string;
  physicalDefects: string;
  officerRemark: string;
  certificationPapers: boolean;
  boxPackaged: boolean;
};
