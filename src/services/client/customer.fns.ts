import type {
  CustomerDetailResponseType,
  CustomerSessionLogsResponseType,
  CustomersResponseType,
} from "@/types/customer.type";
import apiHandler from "../api-handler";
import CustomerRoute from "../route/customer.route";

export const fetchCustomers = async (query: string = "") => {
  const { data } = await apiHandler.get<CustomersResponseType>(
    `${CustomerRoute.customers}${query ? `?${query}` : ""}`,
  );

  return data;
};

export const fetchCustomer = async (id: string) => {
  const { data } = await apiHandler.get<CustomerDetailResponseType>(
    `${CustomerRoute.customers}/${id}`,
  );

  return data;
};

export const fetchCustomerSessionLogs = async (id: string, query = "") => {
  const { data } = await apiHandler.get<CustomerSessionLogsResponseType>(
    `${CustomerRoute.customers}/${id}/session-logs${query ? `?${query}` : ""}`,
  );

  return data;
};
