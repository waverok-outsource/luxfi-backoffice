const baseUrl = "/v1";

const SupportRoute = {
  tickets: `${baseUrl}/support/tickets`,
  passwordResetRequests: `${baseUrl}/support/password-reset-requests`,
  customerTickets: (customerId: string) => `${baseUrl}/customers/${customerId}/support-tickets`,
};

export default SupportRoute;
