import type { LoansResponseType, RejectionReasonsResponseType } from "@/types/loan.type";
import apiHandler from "../api-handler";
import LoanRoute from "../route/loan.route";

export const fetchCustomerLoans = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<LoansResponseType>(
    `${LoanRoute.customerLoans(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoanRejectionReasons = async () => {
  const { data } = await apiHandler.get<RejectionReasonsResponseType>(LoanRoute.rejectionReasons);

  return data;
};
