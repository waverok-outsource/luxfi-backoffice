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
};

export default LoanRoute;
