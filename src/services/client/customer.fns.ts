import type {
  CustomerAnalyticsResponseType,
  CustomerDetailResponseType,
  CustomerSessionLogsResponseType,
  CustomersResponseType,
  KycTiersResponseType,
} from "@/types/customer.type";
import apiHandler from "../api-handler";
import CustomerRoute from "../route/customer.route";

export const fetchCustomerAnalytics = async (query: string = "") => {
  const { data } = await apiHandler.get<CustomerAnalyticsResponseType>(
    `${CustomerRoute.analytics}${query ? `?${query}` : ""}`,
  );

  return data;
};

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

// Defaults to a large perPage since the endpoint is paginated but callers
// (the KYC tier dropdown on asset underwriting) need the full list.
export const fetchKycTiers = async (query: string = "perPage=100") => {
  const { data } = await apiHandler.get<KycTiersResponseType>(
    `${CustomerRoute.kycTiers}${query ? `?${query}` : ""}`,
  );

  return data;
};
