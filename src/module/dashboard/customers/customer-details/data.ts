export type CustomerDetails = {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  customerSince: string;
  kycTierLabel: string;
  walletBalance: string;
  portfolioValue: string;
  creditScorePercent: number;
};

const mockCustomers: Record<string, CustomerDetails> = {
  CU802725424233: {
    id: "CU802725424233",
    fullName: "Darryl Simmons.",
    emailAddress: "DannyOkoye@gmail.com",
    phoneNumber: "+234 098 987 654",
    customerSince: "10 January, 2026",
    kycTierLabel: "Tier 3 Level Customer",
    walletBalance: "$ 10,543.00",
    portfolioValue: "$ 25,908.00",
    creditScorePercent: 85,
  },
};

export function getMockCustomerDetails(customerId: string): CustomerDetails {
  return (
    mockCustomers[customerId] ?? {
      id: customerId,
      fullName: "Darryl Simmons.",
      emailAddress: "DannyOkoye@gmail.com",
      phoneNumber: "+234 098 987 654",
      customerSince: "10 January, 2026",
      kycTierLabel: "Tier 3 Level Customer",
      walletBalance: "$ 10,543.00",
      portfolioValue: "$ 25,908.00",
      creditScorePercent: 85,
    }
  );
}

