import type { AssetPriceType } from "./asset-management.type";
import type { ApiResponse, PaginatedApiResponse } from "./global";

export type LoanStatus = "pending" | "active" | "liquidated" | "rejected" | "completed";

export type LoanCollateralType = {
  assetName: string;
  media: string[];
  assetValue: AssetPriceType;
  case: { colour: string; size: number; unit: string } | null;
  productionYear: string | null;
  dialColour: string | null;
  isBoxed: boolean | null;
  hasPapers: boolean | null;
  weight: { value: number; unit: string } | null;
};

export type LoanBorrowerType = {
  id: string;
  name: string;
  creditScore: number | null;
  email: string;
};

export type LoanType = {
  loanId: string;
  loanRef: string;
  loanValue: AssetPriceType;
  collateralId: string;
  collateral: LoanCollateralType;
  collateralType: string;
  collateralValue: AssetPriceType;
  ltv: number;
  liquidationThreshold: AssetPriceType | number | null;
  status: LoanStatus;
  amountDisbursed: AssetPriceType;
  amountRemaining: AssetPriceType;
  totalInterest: number;
  totalRepayable: number;
  apr: number;
  interestType: string;
  loanTerm: { value: number; unit: string };
  paymentTerm: { value: number; unit: string };
  dateApplied: string;
  dateDisburse: string | null;
  dueDate: string | null;
  repaidAt: string | null;
  liquidatedAt: string | null;
  borrower: LoanBorrowerType;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type LoansResponseType = PaginatedApiResponse<LoanType[]>;

export type RejectionReasonsResponseType = ApiResponse<string[]>;

export type RejectLoanPayloadType = { rejectionReason: string };

export type ApproveLoanPayloadType = {
  liquidationThreshold: { value: number; currencyCode: string };
  dateDisburse: string; // "YYYY-MM-DD"
};

export type ReviewLoanResponseType = ApiResponse<LoanType>;
