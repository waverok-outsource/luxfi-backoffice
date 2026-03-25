export type HelpSupportMetric = {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "negative";
};

export const helpSupportMetrics: HelpSupportMetric[] = [
  {
    title: "Total Support Tickets",
    value: "312",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Pending Tickets",
    value: "45",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Resolved Tickets",
    value: "100",
    trend: "99.9%",
    tone: "positive",
  },
];

export type HelpSupportTabValue = "support-tickets" | "password-reset-requests";

export const DEFAULT_HELP_SUPPORT_TAB: HelpSupportTabValue = "support-tickets";

export const helpSupportTabs: Array<{
  label: string;
  value: HelpSupportTabValue;
}> = [
  { label: "Support Tickets", value: "support-tickets" },
  { label: "Password Reset Requests", value: "password-reset-requests" },
];

export type SupportTicketStatus = "resolved" | "pending";
export type PasswordResetStatus = "reset" | "pending";
export type HelpSupportChannel = "Mobile" | "Web";

export type SupportTicketRow = {
  id: string;
  ticketId: string;
  issueCategory: string;
  issueDescription: string;
  channel: HelpSupportChannel;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestDateLabel: string;
  dateLabel: string;
  timestampLabel: string;
  status: SupportTicketStatus;
};

export type PasswordResetRequestRow = {
  id: string;
  logId: string;
  username: string;
  userEmail: string;
  channel: HelpSupportChannel;
  assignedRole: string;
  requestTimestampLabel: string;
  dateLabel: string;
  timestampLabel: string;
  status: PasswordResetStatus;
};

export const supportTicketRows: SupportTicketRow[] = [
  {
    id: "support-ticket-1",
    ticketId: "CU-889095542245",
    issueCategory: "KYC Verification",
    issueDescription: "Customer is requesting an update on the pending KYC verification review.",
    channel: "Mobile",
    customerName: "Darryl Simmons",
    customerEmail: "darrylsimmons@gmail.com",
    customerPhone: "+234571866364",
    requestDateLabel: "10/10/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "10:30:00pm",
    status: "resolved",
  },
  {
    id: "support-ticket-2",
    ticketId: "CU-889095542246",
    issueCategory: "Tier Upgrade",
    issueDescription: "Customer has submitted documents and needs help with account tier upgrade.",
    channel: "Web",
    customerName: "Malen Jones",
    customerEmail: "malenjones@gmail.com",
    customerPhone: "+234701866364",
    requestDateLabel: "10/10/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "10:30:00pm",
    status: "resolved",
  },
  {
    id: "support-ticket-3",
    ticketId: "CU-889095542247",
    issueCategory: "Asset Valuation",
    issueDescription: "Customer is asking for an update on the submitted asset valuation request.",
    channel: "Mobile",
    customerName: "Sarah Myles",
    customerEmail: "sarahmyles@gmail.com",
    customerPhone: "+234801866364",
    requestDateLabel: "10/10/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "10:30:00pm",
    status: "pending",
  },
  {
    id: "support-ticket-4",
    ticketId: "CU-889095542248",
    issueCategory: "Loan Repayment",
    issueDescription: "Customer says the completed repayment is not reflecting on the dashboard.",
    channel: "Web",
    customerName: "Ryan Fraser",
    customerEmail: "ryanfraser@gmail.com",
    customerPhone: "+234811866364",
    requestDateLabel: "10/10/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "10:30:00pm",
    status: "pending",
  },
  {
    id: "support-ticket-5",
    ticketId: "CU-889095542249",
    issueCategory: "Wallet Funding",
    issueDescription: "Customer completed a wallet top-up but the balance has not updated yet.",
    channel: "Mobile",
    customerName: "Freda James",
    customerEmail: "fredajames@gmail.com",
    customerPhone: "+234821866364",
    requestDateLabel: "10/10/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "10:30:00pm",
    status: "pending",
  },
];

export const passwordResetRequestRows: PasswordResetRequestRow[] = [
  {
    id: "password-reset-1",
    logId: "890955422245",
    username: "Dare Abdullahi",
    userEmail: "dare.abdullahi@pawnshopbyblu.com",
    channel: "Web",
    assignedRole: "Marketing Officer",
    requestTimestampLabel: "10 - 01 -2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    status: "reset",
  },
  {
    id: "password-reset-2",
    logId: "890955422246",
    username: "Oreoluwa Akinmagbe",
    userEmail: "oreoluwa.akinmagbe@pawnshopbyblu.com",
    channel: "Web",
    assignedRole: "Compliance Officer",
    requestTimestampLabel: "10 - 01 -2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    status: "pending",
  },
  {
    id: "password-reset-3",
    logId: "890955422247",
    username: "John Ndubuisi",
    userEmail: "johnndubuisi@pawnshopbyblu.com",
    channel: "Mobile",
    assignedRole: "Risk Manager",
    requestTimestampLabel: "10 - 01 -2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    status: "pending",
  },
  {
    id: "password-reset-4",
    logId: "890955422248",
    username: "Hannah Amarachi",
    userEmail: "hannahamarachi@pawnshopbyblu.com",
    channel: "Web",
    assignedRole: "Finance Manager",
    requestTimestampLabel: "10 - 01 -2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    status: "pending",
  },
  {
    id: "password-reset-5",
    logId: "890955422249",
    username: "Fred Bassey",
    userEmail: "fred.bassey@pawnshopbyblu.com",
    channel: "Mobile",
    assignedRole: "Business operations",
    requestTimestampLabel: "10 - 01 -2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    status: "pending",
  },
];
