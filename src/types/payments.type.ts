import { ApiResponse, PaginatedApiResponse } from "./global";

export type PaymentApprover = {
  id: string | null;
  role: string | null;
};

export type PaymentPartyRef = {
  id: string;
  name: string;
  email: string;
};

// Asset Sales History
export type AssetSaleHistoryItem = {
  id: string;
  orderId: string;
  transactionId: string;
  assetId: string;
  asset: string;
  transactionValue: number;
  buyer: string;
  buyerId: string;
  date: string;
  paymentStatus: string;
};

export type AssetSaleHistoryListResponse = PaginatedApiResponse<AssetSaleHistoryItem[]>;

export type AssetSaleHistoryDetails = {
  id: string;
  orderId: string;
  logId: string;
  transactionDate: string;
  timestamp: string;
  paymentMethod: string;
  paymentChannel: string;
  saleValue: number;
  status: string;
  buyer: PaymentPartyRef;
  approver: PaymentApprover;
};

export type AssetSaleHistoryDetailsResponse = ApiResponse<AssetSaleHistoryDetails>;

// Asset Purchase History
export type AssetPurchaseHistoryItem = {
  id: string;
  orderId: string;
  transactionId: string;
  assetId: string;
  transactionValue: number;
  seller: string;
  sellerId: string;
  pawnRepresentative: string;
  date: string;
  paymentStatus: string;
};

export type AssetPurchaseHistoryListResponse = PaginatedApiResponse<AssetPurchaseHistoryItem[]>;

export type AssetPurchaseHistoryLineItem = {
  name: string;
  price: number;
  quantity: number;
  assetId: string;
  subtotal: number;
};

export type AssetPurchaseHistoryDetails = {
  id: string;
  orderId: string;
  logId: string;
  transactionDate: string;
  timestamp: string;
  paymentMethod: string;
  paymentChannel: string;
  saleValue: number;
  status: string;
  seller: PaymentPartyRef;
  approver: PaymentApprover;
  items: AssetPurchaseHistoryLineItem[];
};

export type AssetPurchaseHistoryDetailsResponse = ApiResponse<AssetPurchaseHistoryDetails>;

// Customer Deposit
export type CustomerDepositItem = {
  id: string;
  transactionId: string;
  customerId: string;
  depositValue: number;
  walletId: string;
  currency: string;
  transactionDate: string;
  status: string;
};

export type CustomerDepositListResponse = PaginatedApiResponse<CustomerDepositItem[]>;

export type CustomerDepositDetails = {
  customer: PaymentPartyRef;
  id: string;
  logId: string;
  transactionDate: string;
  timestamp: string;
  paymentMethod: string;
  paymentChannel: string;
  depositValue: number;
  status: string;
  walletId: string;
  approver: PaymentApprover;
};

export type CustomerDepositDetailsResponse = ApiResponse<CustomerDepositDetails>;

// Loan Disbursement
export type LoanDisbursementItem = {
  id: string;
  transactionId: string;
  loanId: string;
  loanValue: number;
  disbursedValue: number;
  transactionDate: string;
  status: string;
};

export type LoanDisbursementListResponse = PaginatedApiResponse<LoanDisbursementItem[]>;

export type LoanDisbursementDetails = {
  customer: PaymentPartyRef;
  id: string;
  logId: string;
  transactionDate: string;
  timestamp: string;
  paymentMethod: string;
  paymentChannel: string;
  loanValue: number;
  disbursedValue: number;
  status: string;
  approver: PaymentApprover;
};

export type LoanDisbursementDetailsResponse = ApiResponse<LoanDisbursementDetails>;

// Loans Repayment
export type LoanRepaymentItem = {
  id: string;
  transactionId: string;
  loanId: string;
  loanValue: number;
  repaidValue: number;
  transactionDate: string;
  status: string;
};

export type LoanRepaymentListResponse = PaginatedApiResponse<LoanRepaymentItem[]>;

export type LoanRepaymentDetails = {
  customer: PaymentPartyRef;
  id: string;
  logId: string;
  transactionDate: string;
  timestamp: string;
  paymentMethod: string;
  paymentChannel: string;
  loanValue: number;
  repaidValue: number;
  status: string;
  approver: PaymentApprover;
};

export type LoanRepaymentDetailsResponse = ApiResponse<LoanRepaymentDetails>;
