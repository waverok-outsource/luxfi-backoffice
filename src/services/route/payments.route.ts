const baseUrl = "/v1/payments";

const PaymentsRoute = {
  analytics: "/v1/analytics/payments",
  assetSalesHistory: `${baseUrl}/asset-sales-history`,
  assetSaleDetails: (id: string) => `${baseUrl}/asset-sales-history/${id}`,
  assetPurchaseHistory: `${baseUrl}/asset-purchase-history`,
  assetPurchaseDetails: (id: string) => `${baseUrl}/asset-purchase-history/${id}`,
  customerDeposit: `${baseUrl}/customer-deposit`,
  customerDepositDetails: (id: string) => `${baseUrl}/customer-deposit/${id}`,
  loanDisbursement: `${baseUrl}/loan-disbursement`,
  loanDisbursementDetails: (id: string) => `${baseUrl}/loan-disbursement/${id}`,
  loansRepayment: `${baseUrl}/loans-repayment`,
  loansRepaymentDetails: (id: string) => `${baseUrl}/loans-repayment/${id}`,
};

export default PaymentsRoute;
