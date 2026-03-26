export type AssetLoansMetric = {
  title: string;
  value: string;
  trend: string;
  period: string;
  tone: "positive" | "negative";
};

export const assetLoansMetrics: AssetLoansMetric[] = [
  {
    title: "Total Loan Disbursed",
    value: "$2,960,000",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Interest Accrued",
    value: "$2,960,000",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Loan Repaid",
    value: "$4,820,000",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Active Loans",
    value: "312",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Near Liquidations",
    value: "27",
    trend: "-10%",
    period: "Last 7 days",
    tone: "negative",
  },
];

export type AssetLoanTabValue =
  | "asset-loan-requests"
  | "loan-repayments"
  | "loan-disbursements"
  | "loan-activity-logs";

export const DEFAULT_ASSET_LOANS_TAB: AssetLoanTabValue = "asset-loan-requests";

export const assetLoansTabs: Array<{
  label: string;
  value: AssetLoanTabValue;
}> = [
  { label: "Asset Loan Requests", value: "asset-loan-requests" },
  { label: "Loan Repayments", value: "loan-repayments" },
  { label: "Loan Disbursements", value: "loan-disbursements" },
  { label: "Loan Activity Logs", value: "loan-activity-logs" },
];

export type AssetLoanStatus =
  | "pending"
  | "active"
  | "liquidated"
  | "rejected"
  | "completed";

export type AssetLoanRequestRow = {
  id: string;
  loanId: string;
  borrowerId: string;
  loanValue: number;
  collateralValue: number;
  ltv: number;
  liquidationThreshold: number;
  status: AssetLoanStatus;
};

export type LoanRepaymentRow = {
  id: string;
  repaymentId: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  loanValue: number;
  interestAccrued: number;
  repaidValue: number;
  repaymentDate: string;
  dateLabel: string;
  timestampLabel: string;
  paymentMethod: string;
  paymentChannel: string;
  status: AssetLoanStatus;
};

export type LoanDisbursementRow = {
  id: string;
  disbursementId: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  loanValue: number;
  disbursedValue: number;
  disbursementDate: string;
  dateLabel: string;
  timestampLabel: string;
  paymentMethod: string;
  paymentChannel: string;
  status: AssetLoanStatus;
};

export type LoanActivityLogRow = {
  id: string;
  logId: string;
  activity: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: string;
  actionDate: string;
  actionTimestamp: string;
};

export const assetLoanRequestRows: AssetLoanRequestRow[] = [
  {
    id: "loan-request-1",
    loanId: "CU-889095542245",
    borrowerId: "CU-889095542245",
    loanValue: 6000,
    collateralValue: 10000,
    ltv: 57.7,
    liquidationThreshold: 57.7,
    status: "pending",
  },
  {
    id: "loan-request-2",
    loanId: "CU-889095542246",
    borrowerId: "CU-889095542246",
    loanValue: 100000,
    collateralValue: 150000,
    ltv: 60.9,
    liquidationThreshold: 60.9,
    status: "active",
  },
  {
    id: "loan-request-3",
    loanId: "CU-889095542247",
    borrowerId: "CU-889095542247",
    loanValue: 24000,
    collateralValue: 32000,
    ltv: 78.2,
    liquidationThreshold: 78.2,
    status: "liquidated",
  },
  {
    id: "loan-request-4",
    loanId: "CU-889095542248",
    borrowerId: "CU-889095542248",
    loanValue: 2000,
    collateralValue: 7000,
    ltv: 82.9,
    liquidationThreshold: 82.9,
    status: "rejected",
  },
  {
    id: "loan-request-5",
    loanId: "CU-889095542249",
    borrowerId: "CU-889095542249",
    loanValue: 10000,
    collateralValue: 50000,
    ltv: 55,
    liquidationThreshold: 55,
    status: "completed",
  },
];

export const loanRepaymentRows: LoanRepaymentRow[] = [
  {
    id: "loan-repayment-1",
    repaymentId: "000085752257",
    loanId: "CU-889095542245",
    borrowerId: "CU-889095542245",
    borrowerName: "Darryl Simmons",
    loanValue: 6000,
    interestAccrued: 1000,
    repaidValue: 7000,
    repaymentDate: "05/02/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-repayment-2",
    repaymentId: "000085752258",
    loanId: "CU-889095542246",
    borrowerId: "CU-889095542246",
    borrowerName: "Kristin Watson",
    loanValue: 100000,
    interestAccrued: 50000,
    repaidValue: 150000,
    repaymentDate: "07/02/2026",
    dateLabel: "11th January, 2026",
    timestampLabel: "10:15 AM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "liquidated",
  },
  {
    id: "loan-repayment-3",
    repaymentId: "000085752259",
    loanId: "CU-889095542247",
    borrowerId: "CU-889095542247",
    borrowerName: "Jane Cooper",
    loanValue: 24000,
    interestAccrued: 8000,
    repaidValue: 32000,
    repaymentDate: "07/02/2026",
    dateLabel: "11th January, 2026",
    timestampLabel: "11:40 AM",
    paymentMethod: "Bank Transfer",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-repayment-4",
    repaymentId: "000085752260",
    loanId: "CU-889095542248",
    borrowerId: "CU-889095542248",
    borrowerName: "Brooklyn Simmons",
    loanValue: 2000,
    interestAccrued: 5000,
    repaidValue: 7000,
    repaymentDate: "07/02/2026",
    dateLabel: "12th January, 2026",
    timestampLabel: "01:05 PM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-repayment-5",
    repaymentId: "000085752261",
    loanId: "CU-889095542249",
    borrowerId: "CU-889095542249",
    borrowerName: "Savannah Nguyen",
    loanValue: 10000,
    interestAccrued: 40000,
    repaidValue: 50000,
    repaymentDate: "07/02/2026",
    dateLabel: "12th January, 2026",
    timestampLabel: "03:45 PM",
    paymentMethod: "USDC",
    paymentChannel: "Wallet",
    status: "completed",
  },
];

export const loanDisbursementRows: LoanDisbursementRow[] = [
  {
    id: "loan-disbursement-1",
    disbursementId: "000085752257",
    loanId: "CU-889095542245",
    borrowerId: "CU-889095542245",
    borrowerName: "Darryl Simmons",
    loanValue: 6000,
    disbursedValue: 6000,
    disbursementDate: "05/02/2026",
    dateLabel: "10th January, 2026",
    timestampLabel: "07:20 AM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-disbursement-2",
    disbursementId: "000085752258",
    loanId: "CU-889095542246",
    borrowerId: "CU-889095542246",
    borrowerName: "Kristin Watson",
    loanValue: 100000,
    disbursedValue: 100000,
    disbursementDate: "07/02/2026",
    dateLabel: "11th January, 2026",
    timestampLabel: "10:15 AM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "pending",
  },
  {
    id: "loan-disbursement-3",
    disbursementId: "000085752259",
    loanId: "CU-889095542247",
    borrowerId: "CU-889095542247",
    borrowerName: "Jane Cooper",
    loanValue: 24000,
    disbursedValue: 24000,
    disbursementDate: "07/02/2026",
    dateLabel: "11th January, 2026",
    timestampLabel: "11:40 AM",
    paymentMethod: "Bank Transfer",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-disbursement-4",
    disbursementId: "000085752260",
    loanId: "CU-889095542248",
    borrowerId: "CU-889095542248",
    borrowerName: "Brooklyn Simmons",
    loanValue: 2000,
    disbursedValue: 2000,
    disbursementDate: "07/02/2026",
    dateLabel: "12th January, 2026",
    timestampLabel: "01:05 PM",
    paymentMethod: "USDT",
    paymentChannel: "Wallet",
    status: "completed",
  },
  {
    id: "loan-disbursement-5",
    disbursementId: "000085752261",
    loanId: "CU-889095542249",
    borrowerId: "CU-889095542249",
    borrowerName: "Savannah Nguyen",
    loanValue: 10000,
    disbursedValue: 10000,
    disbursementDate: "07/02/2026",
    dateLabel: "12th January, 2026",
    timestampLabel: "03:45 PM",
    paymentMethod: "USDC",
    paymentChannel: "Wallet",
    status: "completed",
  },
];

export const loanActivityLogRows: LoanActivityLogRow[] = [
  {
    id: "loan-log-1",
    logId: "000085752257",
    activity: "Loan Approved",
    initiatorId: "000085752257",
    initiatorName: "Dare Abdullahi",
    initiatorRole: "Compliance Officer",
    actionDate: "05/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "loan-log-2",
    logId: "000085752258",
    activity: "Loan Rejected",
    initiatorId: "000085752258",
    initiatorName: "Oreoluwa Akinmagbe",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "loan-log-3",
    logId: "000085752259",
    activity: "Loan Approved",
    initiatorId: "000085752259",
    initiatorName: "John Ndubuisi",
    initiatorRole: "Compliance Officer II",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "loan-log-4",
    logId: "000085752260",
    activity: "Loan Disbursed",
    initiatorId: "000085752260",
    initiatorName: "Hannah Amarachi",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
  {
    id: "loan-log-5",
    logId: "000085752261",
    activity: "Loan Disbursed",
    initiatorId: "000085752261",
    initiatorName: "Fred Bassey",
    initiatorRole: "Finance Manager",
    actionDate: "07/02/2026",
    actionTimestamp: "10:23 AM",
  },
];
