import { useQuery } from "@tanstack/react-query";

import {
  fetchCustomer,
  fetchCustomerSessionLogs,
  fetchCustomers,
} from "@/services/client/customer.fns";
import keyFactory from "@/util/query-key-factory";

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
