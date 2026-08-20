import { useQuery } from "@tanstack/react-query";

import {
  fetchCustomer,
  fetchCustomerAnalytics,
  fetchCustomerSessionLogs,
  fetchCustomers,
  fetchKycTiers,
} from "@/services/client/customer.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerAnalytics = (query: string = "") =>
  useQuery({
    queryKey: keyFactory.customers.analytics(query),
    queryFn: () => fetchCustomerAnalytics(query),
  });

export const useCustomers = (query: string) =>
  useQuery({
    queryKey: keyFactory.customers.list(query),
    queryFn: () => fetchCustomers(query),
  });

export const useCustomer = (id: string) =>
  useQuery({
    queryKey: keyFactory.customers.details(id),
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });

export const useCustomerSessionLogs = (customerId: string, query: string) =>
  useQuery({
    queryKey: [...keyFactory.customers.sessionLogs(customerId), query],
    queryFn: () => fetchCustomerSessionLogs(customerId, query),
    enabled: Boolean(customerId),
  });

export const useKycTiers = () =>
  useQuery({
    queryKey: keyFactory.customers.kycTiers.list("perPage=100"),
    queryFn: () => fetchKycTiers(),
  });
