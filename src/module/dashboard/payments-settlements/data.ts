export type PaymentsMetric = {
  title: string;
  value: string;
  trend: string;
  period?: string;
  tone: "positive" | "negative";
};

export const leadingMetrics: PaymentsMetric[] = [
  {
    title: "Total Inflow",
    value: "$ 2,705,987.00",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Total Outflow",
    value: "- $ 1,905,987.00",
    trend: "99.9%",
    tone: "negative",
  },
];

export const trailingMetrics: PaymentsMetric[] = [
  {
    title: "Wallet Deposits",
    value: "$ 905,987.00",
    trend: "99.9%",
    tone: "positive",
  },
  {
    title: "Interest Settlements",
    value: "$ 25,442.00",
    trend: "99.9%",
    tone: "positive",
  },
];

export const assetTradeSummary = {
  sales: {
    title: "Asset Sales",
    value: "$ 1,005,987.00",
    trend: "99.9%",
    tone: "positive" as const,
  },
  purchases: {
    title: "Asset Purchases",
    value: "$ 1,005,987.00",
    trend: "99.9%",
    tone: "positive" as const,
  },
};

export type PaymentsHistoryTabValue =
  | "asset-sales"
  | "asset-purchases"
  | "loan-repayments"
  | "loan-disbursements"
  | "wallet-deposits"
  | "interest-settlements";

export const DEFAULT_PAYMENTS_HISTORY_TAB: PaymentsHistoryTabValue = "asset-sales";

export const paymentsHistoryTabs: Array<{
  label: string;
  value: PaymentsHistoryTabValue;
}> = [
  { label: "Asset Sales History", value: "asset-sales" },
  { label: "Asset Purchase History", value: "asset-purchases" },
  { label: "Loan Repayment History", value: "loan-repayments" },
  { label: "Loan Disbursement History", value: "loan-disbursements" },
  { label: "Customer Wallet Deposits", value: "wallet-deposits" },
  { label: "Interest Settlements", value: "interest-settlements" },
];

export type PaymentStatus = "completed" | "pending" | "failed" | "liquidated";

export type PaymentSettlementRow = {
  id: string;
  transactionId: string;
  assetId: string;
  asset: string;
  transactionValue: number;
  loanId?: string;
  loanValue?: number;
  repaidValue?: number;
  disbursedValue?: number;
  partyName: string;
  date: string;
  dateLabel: string;
  timestampLabel: string;
  paymentMethod: string;
  paymentChannel: string;
  partyId: string;
  partyEmail: string;
  representativeName?: string;
  approverId: string;
  approverRole: string;
  status: PaymentStatus;
};

type SeedRow = Omit<
  PaymentSettlementRow,
  | "id"
  | "date"
  | "dateLabel"
  | "timestampLabel"
  | "paymentMethod"
  | "paymentChannel"
  | "partyId"
  | "partyEmail"
  | "approverId"
  | "approverRole"
> & {
  date?: string;
};

const partyNames = [
  "Darryl Simmons",
  "Malen Jones",
  "Sarah Myles",
  "Ryan Fraser",
  "Freda James",
  "Yinka Thomas",
  "Nora Alexander",
  "Irene Wilson",
  "Miles Harper",
  "Amara Cole",
  "Tobi Austin",
  "Helen Price",
] as const;

const pawnRepresentatives = [
  "Dare Abdullahi",
  "Oreoluwa Akinmagbe",
  "John Ndubuisi",
  "Hannah Amarachi",
  "Fred Bassey",
  "Miriam Okafor",
  "Chinedu Nwosu",
  "Adaeze Obasi",
  "Ifeanyi Ugo",
  "Daniel Kingsley",
  "Tega Wilcox",
  "Amaka Daniels",
] as const;

const statusCycle: PaymentStatus[] = [
  "completed",
  "pending",
  "failed",
  "completed",
  "completed",
  "pending",
];

const assetCatalog: Record<PaymentsHistoryTabValue, readonly string[]> = {
  "asset-sales": [
    "Rolex Daytona 116...",
    "Patek Philippe",
    "Rolex Day-Dweller",
    "Rolex Submariner",
    "Audemar Piguet",
    "Cartier Santos",
    "Hublot Big Bang",
  ],
  "asset-purchases": [
    "Richard Mille RM...",
    "Birkin 35 Togo",
    "Cartier Tank Solo",
    "Rolex GMT-Master",
    "Louis Vuitton Capucines",
    "Patek Nautilus",
  ],
  "loan-repayments": [
    "Rolex Day-Date",
    "Hermes Kelly 28",
    "Audemars Royal Oak",
    "Van Cleef Bracelet",
    "Omega Speedmaster",
  ],
  "loan-disbursements": [
    "Rolex Oysterflex",
    "Chanel Classic Flap",
    "Cartier Panthere",
    "Patek Aquanaut",
    "Rolex Yacht-Master",
  ],
  "wallet-deposits": [
    "USDT Wallet Funding",
    "USDC Wallet Top-up",
    "NGN Card Deposit",
    "Bank Transfer Settlement",
    "Crypto Wallet Credit",
  ],
  "interest-settlements": [
    "USDT Interest Settlement",
    "USDC Interest Settlement",
    "Wallet Yield Settlement",
    "Savings Interest Settlement",
    "Promotional Interest Credit",
  ],
};

export const assetSalesSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    asset: "Rolex Daytona 116...",
    transactionValue: 6000,
    partyName: "Darryl Simmons",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    asset: "Patek Philippe",
    transactionValue: 10000,
    partyName: "Malen Jones",
    status: "pending",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    asset: "Rolex Day-Dweller",
    transactionValue: 24000,
    partyName: "Sarah Myles",
    status: "failed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    asset: "Rolex Submariner",
    transactionValue: 2000,
    partyName: "Ryan Fraser",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    asset: "Audemar Piguet",
    transactionValue: 6000,
    partyName: "Freda James",
    status: "completed",
  },
];

export const assetPurchaseSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    asset: "Richard Mille RM...",
    transactionValue: 6000,
    partyName: "Darryl Simmons",
    representativeName: "Dare Abdullahi",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    asset: "Birkin 35 Togo",
    transactionValue: 10000,
    partyName: "Malen Jones",
    representativeName: "Oreoluwa Akinmagbe",
    status: "pending",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    asset: "Cartier Tank Solo",
    transactionValue: 24000,
    partyName: "Sarah Myles",
    representativeName: "John Ndubuisi",
    status: "completed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    asset: "Rolex GMT-Master",
    transactionValue: 2000,
    partyName: "Ryan Fraser",
    representativeName: "Hannah Amarachi",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    asset: "Louis Vuitton Capucines",
    transactionValue: 6000,
    partyName: "Freda James",
    representativeName: "Fred Bassey",
    status: "completed",
  },
];

export const loanRepaymentSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    loanId: "CU-889095542281",
    asset: "Rolex Day-Date",
    transactionValue: 6000,
    loanValue: 6000,
    repaidValue: 7000,
    partyName: "Darryl Simmons",
    date: "05/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    loanId: "CU-889095542282",
    asset: "Hermes Kelly 28",
    transactionValue: 100000,
    loanValue: 100000,
    repaidValue: 150000,
    partyName: "Malen Jones",
    date: "07/02/2026",
    status: "liquidated",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    loanId: "CU-889095542283",
    asset: "Audemars Royal Oak",
    transactionValue: 24000,
    loanValue: 24000,
    repaidValue: 32000,
    partyName: "Sarah Myles",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    loanId: "CU-889095542284",
    asset: "Van Cleef Bracelet",
    transactionValue: 2000,
    loanValue: 2000,
    repaidValue: 7000,
    partyName: "Ryan Fraser",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    loanId: "CU-889095542285",
    asset: "Omega Speedmaster",
    transactionValue: 10000,
    loanValue: 10000,
    repaidValue: 50000,
    partyName: "Freda James",
    date: "07/02/2026",
    status: "completed",
  },
];

export const loanDisbursementSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    loanId: "CU-889095542281",
    asset: "Rolex Oysterflex",
    transactionValue: 6000,
    loanValue: 6000,
    disbursedValue: 7000,
    partyName: "Darryl Simmons",
    date: "05/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    loanId: "CU-889095542282",
    asset: "Chanel Classic Flap",
    transactionValue: 100000,
    loanValue: 100000,
    disbursedValue: 150000,
    partyName: "Malen Jones",
    date: "07/02/2026",
    status: "liquidated",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    loanId: "CU-889095542283",
    asset: "Cartier Panthere",
    transactionValue: 24000,
    loanValue: 24000,
    disbursedValue: 32000,
    partyName: "Sarah Myles",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    loanId: "CU-889095542284",
    asset: "Patek Aquanaut",
    transactionValue: 2000,
    loanValue: 2000,
    disbursedValue: 7000,
    partyName: "Ryan Fraser",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    loanId: "CU-889095542285",
    asset: "Rolex Yacht-Master",
    transactionValue: 10000,
    loanValue: 10000,
    disbursedValue: 50000,
    partyName: "Freda James",
    date: "07/02/2026",
    status: "completed",
  },
];

export const walletDepositSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    asset: "USDT",
    transactionValue: 6000,
    partyName: "Darryl Simmons",
    date: "05/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    asset: "USDT",
    transactionValue: 100000,
    partyName: "Malen Jones",
    date: "07/02/2026",
    status: "pending",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    asset: "USDT",
    transactionValue: 24000,
    partyName: "Sarah Myles",
    date: "07/02/2026",
    status: "failed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    asset: "USDT",
    transactionValue: 2000,
    partyName: "Ryan Fraser",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    asset: "USDT",
    transactionValue: 10000,
    partyName: "Freda James",
    date: "07/02/2026",
    status: "completed",
  },
];

export const interestSettlementSeedRows: SeedRow[] = [
  {
    transactionId: "CU-889095542245",
    assetId: "CU-889095542281",
    loanId: "CU-889095542281",
    asset: "USDT",
    transactionValue: 600,
    partyName: "Darryl Simmons",
    date: "05/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542246",
    assetId: "CU-889095542282",
    loanId: "CU-889095542282",
    asset: "USDT",
    transactionValue: 1500,
    partyName: "Malen Jones",
    date: "07/02/2026",
    status: "pending",
  },
  {
    transactionId: "CU-889095542247",
    assetId: "CU-889095542283",
    loanId: "CU-889095542283",
    asset: "USDT",
    transactionValue: 925,
    partyName: "Sarah Myles",
    date: "07/02/2026",
    status: "failed",
  },
  {
    transactionId: "CU-889095542248",
    assetId: "CU-889095542284",
    loanId: "CU-889095542284",
    asset: "USDT",
    transactionValue: 1245,
    partyName: "Ryan Fraser",
    date: "07/02/2026",
    status: "completed",
  },
  {
    transactionId: "CU-889095542249",
    assetId: "CU-889095542285",
    loanId: "CU-889095542285",
    asset: "USDT",
    transactionValue: 100,
    partyName: "Freda James",
    date: "07/02/2026",
    status: "completed",
  },
];

const seedRowsByTab: Record<PaymentsHistoryTabValue, SeedRow[]> = {
  "asset-sales": assetSalesSeedRows,
  "asset-purchases": assetPurchaseSeedRows,
  "loan-repayments": loanRepaymentSeedRows,
  "loan-disbursements": loanDisbursementSeedRows,
  "wallet-deposits": walletDepositSeedRows,
  "interest-settlements": interestSettlementSeedRows,
};

function formatCurrencySeed(baseValue: number, step: number, serial: number) {
  return baseValue + (serial % 7) * step;
}

function makeEmailFromName(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
}

function makePartyId(tab: PaymentsHistoryTabValue, serial: number) {
  if (tab === "wallet-deposits") {
    return makeTransactionId(tab, serial + 43, "transaction");
  }

  return `${String(85752250 + serial).padStart(11, "0")}`;
}

function getApproverDetails(tab: PaymentsHistoryTabValue) {
  if (tab === "wallet-deposits" || tab === "loan-disbursements") {
    return {
      approverId: "Akintayojames@pawnshopbyblu.com",
      approverRole: "Finance Manager",
    };
  }

  return {
    approverId: "Johnekanem@pawnshopbyblu.com",
    approverRole: "Marketing Officer",
  };
}

function makeTransactionId(
  tab: PaymentsHistoryTabValue,
  serial: number,
  prefix: "transaction" | "asset",
) {
  const tabCode = {
    "asset-sales": prefix === "transaction" ? "CU" : "CU",
    "asset-purchases": prefix === "transaction" ? "CU" : "CU",
    "loan-repayments": prefix === "transaction" ? "CU" : "CU",
    "loan-disbursements": prefix === "transaction" ? "CU" : "CU",
    "wallet-deposits": prefix === "transaction" ? "CU" : "CU",
    "interest-settlements": prefix === "transaction" ? "CU" : "CU",
  }[tab];

  return `${tabCode}-${889095542200 + serial}`;
}

function generateTabRows(tab: PaymentsHistoryTabValue, total: number): PaymentSettlementRow[] {
  const seeds = seedRowsByTab[tab];
  const assets = assetCatalog[tab];

  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const seeded = seeds[index];

    if (seeded) {
      const approverDetails = getApproverDetails(tab);
      return {
        id: `${tab}-${serial}`,
        date: seeded.date ?? "10/01/2026",
        dateLabel: "10th January, 2026",
        timestampLabel: "07:20 AM",
        paymentMethod: "USDT",
        paymentChannel: "Wallet",
        partyId: makePartyId(tab, serial),
        partyEmail: makeEmailFromName(seeded.partyName),
        ...approverDetails,
        ...seeded,
      };
    }

    const asset = assets[index % assets.length];
    const partyName = partyNames[index % partyNames.length];
    const status = statusCycle[index % statusCycle.length];
    const transactionValueByTab = {
      "asset-sales": formatCurrencySeed(4000, 1500, serial),
      "asset-purchases": formatCurrencySeed(5200, 1100, serial),
      "loan-repayments": formatCurrencySeed(1200, 450, serial),
      "loan-disbursements": formatCurrencySeed(3500, 1400, serial),
      "wallet-deposits": formatCurrencySeed(700, 250, serial),
      "interest-settlements": formatCurrencySeed(350, 175, serial),
    }[tab];
    const representativeName =
      tab === "asset-purchases"
        ? pawnRepresentatives[index % pawnRepresentatives.length]
        : undefined;
    const loanValueByTab =
      tab === "loan-repayments" || tab === "loan-disbursements"
        ? transactionValueByTab
        : undefined;
    const repaidValueByTab =
      tab === "loan-repayments"
        ? transactionValueByTab + ((serial % 5) + 1) * 1000
        : undefined;
    const disbursedValueByTab =
      tab === "loan-disbursements"
        ? transactionValueByTab + ((serial % 5) + 1) * 1000
        : undefined;
    const approverDetails = getApproverDetails(tab);

    return {
      id: `${tab}-${serial}`,
      transactionId: makeTransactionId(tab, serial, "transaction"),
      assetId: makeTransactionId(tab, serial + 43, "asset"),
      asset,
      transactionValue: transactionValueByTab,
      loanId:
        tab === "loan-repayments" ||
        tab === "loan-disbursements" ||
        tab === "interest-settlements"
          ? makeTransactionId(tab, serial + 43, "asset")
          : undefined,
      loanValue: loanValueByTab,
      repaidValue: repaidValueByTab,
      disbursedValue: disbursedValueByTab,
      partyName,
      date: "10/01/2026",
      dateLabel: "10th January, 2026",
      timestampLabel: "07:20 AM",
      paymentMethod: "USDT",
      paymentChannel: "Wallet",
      partyId: makePartyId(tab, serial),
      partyEmail: makeEmailFromName(partyName),
      representativeName,
      ...approverDetails,
      status,
    };
  });
}

export const assetSalesHistoryRows = generateTabRows("asset-sales", 10);
export const assetPurchaseHistoryRows = generateTabRows("asset-purchases", 10);
export const loanRepaymentHistoryRows = generateTabRows("loan-repayments", 10);
export const loanDisbursementHistoryRows = generateTabRows("loan-disbursements", 10);
export const customerWalletDepositRows = generateTabRows("wallet-deposits", 10);
export const interestSettlementRows = generateTabRows("interest-settlements", 10);

export const paymentsHistoryByTab: Record<PaymentsHistoryTabValue, PaymentSettlementRow[]> = {
  "asset-sales": assetSalesHistoryRows,
  "asset-purchases": assetPurchaseHistoryRows,
  "loan-repayments": loanRepaymentHistoryRows,
  "loan-disbursements": loanDisbursementHistoryRows,
  "wallet-deposits": customerWalletDepositRows,
  "interest-settlements": interestSettlementRows,
};
