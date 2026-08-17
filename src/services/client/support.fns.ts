import type {
  PasswordResetRequestsResponseType,
  SupportCaseAnalyticsResponseType,
  SupportTicketsResponseType,
} from "@/types/support.type";
import apiHandler from "../api-handler";
import SupportRoute from "../route/support.route";

export const fetchSupportCaseAnalytics = async (query: string = "") => {
  const { data } = await apiHandler.get<SupportCaseAnalyticsResponseType>(
    `${SupportRoute.analyticsCases}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchSupportTickets = async (query: string = "") => {
  const { data } = await apiHandler.get<SupportTicketsResponseType>(
    `${SupportRoute.tickets}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchCustomerSupportTickets = async (customerId: string, query: string = "") => {
  const { data } = await apiHandler.get<SupportTicketsResponseType>(
    `${SupportRoute.customerTickets(customerId)}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchPasswordResetRequests = async (query: string = "") => {
  const { data } = await apiHandler.get<PasswordResetRequestsResponseType>(
    `${SupportRoute.passwordResetRequests}${query ? `?${query}` : ""}`,
  );

  return data;
};

