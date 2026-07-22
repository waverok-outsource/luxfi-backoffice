export type CustomersTabValue = "registered-customers" | "audit-log";

type TabConfig = {
  value: CustomersTabValue;
  label: string;
};

export const customersTabs: TabConfig[] = [
  { value: "registered-customers", label: "Registered Customers" },
  { value: "audit-log", label: "Audit Log" },
];

export const DEFAULT_CUSTOMERS_TAB: CustomersTabValue = "registered-customers";

export type CustomerChannelStat = {
  label: string;
  count: number;
  percent: number;
  tone: "success" | "error";
};
