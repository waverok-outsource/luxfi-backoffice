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

export type CustomerStat = {
  title: string;
  value: string;
  trend: string;
  period: string;
  tone: "positive" | "negative";
};

export const customerStats: CustomerStat[] = [
  {
    title: "Total Registered Customers",
    value: "2,765",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Average Customer Growth",
    value: "24",
    trend: "-10%",
    period: "Last 7 days",
    tone: "negative",
  },
];

export type CustomerChannelStat = {
  label: string;
  count: number;
  percent: number;
  tone: "success" | "error";
};

export const customerChannels: CustomerChannelStat[] = [
  { label: "Online Customers", count: 2654, percent: 75, tone: "success" },
  { label: "Offline Customers", count: 210, percent: 25, tone: "error" },
];

export type CustomerStatus = "active" | "blacklisted";

export type CustomerTableRow = Record<string, string | number> & {
  id: string;
  status: CustomerStatus;
};

