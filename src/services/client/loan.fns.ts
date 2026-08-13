import type {
  LoanDetailsResponseType,
  LoanScheduleResponseType,
  LoansResponseType,
  RejectionReasonsResponseType,
} from "@/types/loan.type";
import apiHandler from "../api-handler";
import LoanRoute from "../route/loan.route";

export const fetchCustomerLoans = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<LoansResponseType>(
    `${LoanRoute.customerLoans(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoans = async (query: string = "") => {
  const { data } = await apiHandler.get<LoansResponseType>(
    `${LoanRoute.loans}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchLoanById = async (loanRef: string) => {
  const { data } = await apiHandler.get<LoanDetailsResponseType>(LoanRoute.details(loanRef));

  return data;
};

export const fetchLoanSchedule = async (loanRef: string) => {
  const { data } = await apiHandler.get<LoanScheduleResponseType>(LoanRoute.schedule(loanRef));

  return data;
};

export const fetchLoanRejectionReasons = async () => {
  const { data } = await apiHandler.get<RejectionReasonsResponseType>(LoanRoute.rejectionReasons);

  return data;
};
