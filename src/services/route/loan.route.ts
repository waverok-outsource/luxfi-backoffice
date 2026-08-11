const baseUrl = "/v1";

const LoanRoute = {
  customerLoans: (customerId: string) => `${baseUrl}/customers/${customerId}/loans`,
  loans: `${baseUrl}/loans`,
  rejectionReasons: `${baseUrl}/loans/rejection-reasons`,
  reject: (loanRef: string) => `${baseUrl}/loans/${loanRef}/reject`,
  approve: (loanRef: string) => `${baseUrl}/loans/${loanRef}/approve`,
};

export default LoanRoute;
