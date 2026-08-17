import { useQuery } from "@tanstack/react-query";

import {
  fetchCustomerLoans,
  fetchLoanAnalytics,
  fetchLoanById,
  fetchLoanRejectionReasons,
  fetchLoanSchedule,
  fetchLoans,
} from "@/services/client/loan.fns";
import keyFactory from "@/util/query-key-factory";

export const useLoanAnalytics = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.loans.analytics(query),
    queryFn: () => fetchLoanAnalytics(query),
  });

export const useCustomerLoans = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.loans.customerList(customerId, query),
    queryFn: () => fetchCustomerLoans(customerId, query),
    enabled: Boolean(customerId),
  });

export const useLoans = (query: string) =>
  useQuery({
    queryKey: keyFactory.loans.list(query),
    queryFn: () => fetchLoans(query),
  });

export const useLoanById = (loanRef: string) =>
  useQuery({
    queryKey: keyFactory.loans.details(loanRef),
    queryFn: () => fetchLoanById(loanRef),
    enabled: Boolean(loanRef),
  });

export const useLoanSchedule = (loanRef: string) =>
  useQuery({
    queryKey: keyFactory.loans.schedule(loanRef),
    queryFn: () => fetchLoanSchedule(loanRef),
    enabled: Boolean(loanRef),
  });

export const useLoanRejectionReasons = () =>
  useQuery({
    queryKey: keyFactory.loans.rejectionReasons,
    queryFn: fetchLoanRejectionReasons,
  });
