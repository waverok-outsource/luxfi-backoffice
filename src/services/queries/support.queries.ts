import { useQuery } from "@tanstack/react-query";

import {
  fetchCustomerSupportTickets,
  fetchPasswordResetRequests,
  fetchSupportTickets,
} from "@/services/client/support.fns";
import keyFactory from "@/util/query-key-factory";

export const useSupportTickets = (query: string) =>
  useQuery({
    queryKey: keyFactory.support.tickets.list(query),
    queryFn: () => fetchSupportTickets(query),
  });

export const useCustomerSupportTickets = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.support.customerTickets.list(customerId, query),
    queryFn: () => fetchCustomerSupportTickets(customerId, query),
    enabled: Boolean(customerId),
  });

export const usePasswordResetRequests = (query: string) =>
  useQuery({
    queryKey: keyFactory.support.passwordResetRequests.list(query),
    queryFn: () => fetchPasswordResetRequests(query),
  });
