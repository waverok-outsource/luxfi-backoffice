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

export type LoanAmountBreakdownType = { principal: number; interest: number; fees: number; penalty: number };

// The schedule embedded directly on the loan object (both list and detail) — null until the loan
// is active/disbursed. Distinct from LoanScheduleType (GET /v1/loans/:loanRef/schedule), which can
// return a *projected* schedule even before this one exists.
export type LoanEmbeddedScheduleInstallmentType = {
  installmentNumber: number;
  dueDate: string;
  status: string;
  scheduledAmount: number;
  scheduled: LoanAmountBreakdownType;
  paid: LoanAmountBreakdownType;
  paidAmount: number;
  outstandingAmount: number;
  openingBalance: number;
  closingBalance: number;
  daysPastDue: number;
  paidAt?: string;
  lastPaymentAt?: string;
};

export type LoanEmbeddedScheduleType = {
  scheduleId: string;
  scheduleStatus: string;
  installmentCount: number;
  completedInstallments: number;
  overdueInstallments: number;
  totalScheduledAmount: number;
  totalPaidAmount: number;
  totalOutstandingAmount: number;
  nextDueDate: string;
  maturityDate: string;
  installments: LoanEmbeddedScheduleInstallmentType[];
};

// NOTE: on these nested records, loanId/loanRef are swapped relative to the top-level loan object
// (loanId here holds the Mongo ref, loanRef holds the human-readable CU-... code) — confirmed against
// a real payload, not a typo on our side. Typed to match reality; flag to the backend team.
export type LoanDisbursementRecordType = {
  _id: string;
  userId: string;
  loanId: string;
  loanRef: string;
  paymentId: string;
  walletId: string;
  amount: number;
  currency: string;
  status: string;
  channel: string;
  paymentReference: string;
  processor: string;
  paymentDate: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
};

export type LoanPaymentRecordType = {
  _id: string;
  userId: string;
  loanId: string;
  loanRef: string;
  paymentId: string;
  walletId: string;
  amountPaid: number;
  amountRemaining: number;
  principal: number;
  interest: number;
  fees: number;
  penalty: number;
  balance: number;
  status: string;
  channel: string;
  paymentReference: string;
  providerReference: string | null;
  processor: string;
  paymentDate: string;
  effectiveDate: string;
  installmentNumber: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type LoanType = {
  loanId: string;
  loanRef: string;
  loanValue: AssetPriceType;
  collateralId: string;
  collateral: LoanCollateralType;
  collateralType: string;
  collateralValue: AssetPriceType;
  assetClassId: string;
  assetType: string;
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
  schedule: LoanEmbeddedScheduleType | null;
  /** Confirmed present on GET /v1/loans/:loanRef (single loan); not sampled on the list endpoint. */
  disbursements?: LoanDisbursementRecordType[];
  /** Confirmed present on GET /v1/loans/:loanRef (single loan); not sampled on the list endpoint. */
  payments?: LoanPaymentRecordType[];
};

export type LoansResponseType = PaginatedApiResponse<LoanType[]>;

export type LoanDetailsResponseType = ApiResponse<LoanType>;

export type LoanScheduleInstallmentType = {
  installmentNumber: number;
  dueDate: string;
  status: string;
  scheduledAmount: number;
  scheduled: { principal: number; interest: number; fees: number; penalty: number };
  paidAmount: number;
  outstandingAmount: number;
  openingBalance: number;
  closingBalance: number;
};

export type LoanScheduleMonthlyBreakdownType = {
  year: number;
  month: number;
  label: string;
  installmentCount: number;
  totalAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  installmentNumbers: number[];
};

export type LoanScheduleType = {
  loanId: string;
  loanRef: string;
  status: string;
  scheduleStatus: string | null;
  projected: boolean;
  installmentCount: number;
  totalScheduledAmount: number;
  totalPaidAmount: number;
  totalOutstandingAmount: number;
  maturityDate: string;
  nextDueDate: string;
  installments: LoanScheduleInstallmentType[];
  monthlyBreakdown: LoanScheduleMonthlyBreakdownType[];
};

export type LoanScheduleResponseType = ApiResponse<LoanScheduleType>;

export type RejectionReasonsResponseType = ApiResponse<string[]>;

export type RejectLoanPayloadType = { rejectionReason: string };

export type ApproveLoanPayloadType = {
  liquidationThreshold: { value: number; currencyCode: string };
  dateDisburse: string; // "YYYY-MM-DD"
};

export type ReviewLoanResponseType = ApiResponse<LoanType>;
