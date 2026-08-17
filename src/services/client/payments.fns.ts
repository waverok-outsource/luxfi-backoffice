import type {
  AssetPurchaseHistoryDetailsResponse,
  AssetPurchaseHistoryListResponse,
  AssetSaleHistoryDetailsResponse,
  AssetSaleHistoryListResponse,
  CustomerDepositDetailsResponse,
  CustomerDepositListResponse,
  LoanDisbursementDetailsResponse,
  LoanDisbursementListResponse,
  LoanRepaymentDetailsResponse,
  LoanRepaymentListResponse,
  PaymentsAnalyticsResponseType,
} from "@/types/payments.type";
import apiHandler from "../api-handler";
import PaymentsRoute from "../route/payments.route";

export const fetchPaymentsAnalytics = async (query: string = "") => {
  const { data } = await apiHandler.get<PaymentsAnalyticsResponseType>(
    `${PaymentsRoute.analytics}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchAssetSalesHistory = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetSaleHistoryListResponse>(
    `${PaymentsRoute.assetSalesHistory}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchAssetSaleDetails = async (id: string) => {
  const { data } = await apiHandler.get<AssetSaleHistoryDetailsResponse>(
    PaymentsRoute.assetSaleDetails(id),
  );

  return data.data;
};

export const fetchAssetPurchaseHistory = async (query: string = "") => {
  const { data } = await apiHandler.get<AssetPurchaseHistoryListResponse>(
    `${PaymentsRoute.assetPurchaseHistory}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchAssetPurchaseDetails = async (id: string) => {
  const { data } = await apiHandler.get<AssetPurchaseHistoryDetailsResponse>(
    PaymentsRoute.assetPurchaseDetails(id),
  );

  return data.data;
};

export const fetchCustomerDeposits = async (query: string = "") => {
  const { data } = await apiHandler.get<CustomerDepositListResponse>(
    `${PaymentsRoute.customerDeposit}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchCustomerDepositDetails = async (id: string) => {
  const { data } = await apiHandler.get<CustomerDepositDetailsResponse>(
    PaymentsRoute.customerDepositDetails(id),
  );

  return data.data;
};

export const fetchLoanDisbursements = async (query: string = "") => {
  const { data } = await apiHandler.get<LoanDisbursementListResponse>(
    `${PaymentsRoute.loanDisbursement}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoanDisbursementDetails = async (id: string) => {
  const { data } = await apiHandler.get<LoanDisbursementDetailsResponse>(
    PaymentsRoute.loanDisbursementDetails(id),
  );

  return data.data;
};

export const fetchLoansRepayment = async (query: string = "") => {
  const { data } = await apiHandler.get<LoanRepaymentListResponse>(
    `${PaymentsRoute.loansRepayment}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoansRepaymentDetails = async (id: string) => {
  const { data } = await apiHandler.get<LoanRepaymentDetailsResponse>(
    PaymentsRoute.loansRepaymentDetails(id),
  );

  return data.data;
};
