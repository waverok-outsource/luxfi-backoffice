const baseUrl = "/v1";

const LoanRoute = {
  analytics: `${baseUrl}/analytics/loans`,
  customerLoans: (customerId: string) => `${baseUrl}/customers/${customerId}/loans`,
  loans: `${baseUrl}/loans`,
  details: (loanRef: string) => `${baseUrl}/loans/${loanRef}`,
  schedule: (loanRef: string) => `${baseUrl}/loans/${loanRef}/schedule`,
  rejectionReasons: `${baseUrl}/loans/rejection-reasons`,
  reject: (loanRef: string) => `${baseUrl}/loans/${loanRef}/reject`,
  approve: (loanRef: string) => `${baseUrl}/loans/${loanRef}/approve`,
  collateralVerificationUploadUrl: (loanRef: string) =>
    `${baseUrl}/loans/${loanRef}/collateral-verification/upload-url`,
  collateralVerification: (loanRef: string) =>
    `${baseUrl}/loans/${loanRef}/collateral-verification`,
  approvedAmount: (loanRef: string) => `${baseUrl}/loans/${loanRef}/approved-amount`,
};

export default LoanRoute;
