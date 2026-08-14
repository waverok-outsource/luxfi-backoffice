import { useQuery } from "@tanstack/react-query";

import {
  fetchAssetPurchaseDetails,
  fetchAssetPurchaseHistory,
  fetchAssetSaleDetails,
  fetchAssetSalesHistory,
  fetchCustomerDepositDetails,
  fetchCustomerDeposits,
  fetchLoanDisbursementDetails,
  fetchLoanDisbursements,
  fetchLoansRepayment,
  fetchLoansRepaymentDetails,
} from "@/services/client/payments.fns";
import keyFactory from "@/util/query-key-factory";

export const useAssetSalesHistory = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.payments.assetSales.list(query),
    queryFn: () => fetchAssetSalesHistory(query),
  });

export const useAssetSaleDetails = (id: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.payments.assetSales.details(id),
    queryFn: () => fetchAssetSaleDetails(id),
    enabled: Boolean(id) && enabled,
  });

export const useAssetPurchaseHistory = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.payments.assetPurchases.list(query),
    queryFn: () => fetchAssetPurchaseHistory(query),
  });

export const useAssetPurchaseDetails = (id: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.payments.assetPurchases.details(id),
    queryFn: () => fetchAssetPurchaseDetails(id),
    enabled: Boolean(id) && enabled,
  });

export const useCustomerDeposits = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.payments.customerDeposits.list(query),
    queryFn: () => fetchCustomerDeposits(query),
  });

export const useCustomerDepositDetails = (id: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.payments.customerDeposits.details(id),
    queryFn: () => fetchCustomerDepositDetails(id),
    enabled: Boolean(id) && enabled,
  });

export const useLoanDisbursements = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.payments.loanDisbursements.list(query),
    queryFn: () => fetchLoanDisbursements(query),
  });

export const useLoanDisbursementDetails = (id: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.payments.loanDisbursements.details(id),
    queryFn: () => fetchLoanDisbursementDetails(id),
    enabled: Boolean(id) && enabled,
  });

export const useLoansRepayment = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.payments.loansRepayments.list(query),
    queryFn: () => fetchLoansRepayment(query),
  });

export const useLoansRepaymentDetails = (id: string, enabled: boolean = true) =>
  useQuery({
    queryKey: keyFactory.payments.loansRepayments.details(id),
    queryFn: () => fetchLoansRepaymentDetails(id),
    enabled: Boolean(id) && enabled,
  });
