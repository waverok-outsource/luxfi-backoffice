import { useQuery } from "@tanstack/react-query";

import { fetchCustomerLoans, fetchLoanRejectionReasons } from "@/services/client/loan.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerLoans = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.loans.customerList(customerId, query),
    queryFn: () => fetchCustomerLoans(customerId, query),
    enabled: Boolean(customerId),
  });

export const useLoanRejectionReasons = () =>
  useQuery({
    queryKey: keyFactory.loans.rejectionReasons,
    queryFn: fetchLoanRejectionReasons,
  });
