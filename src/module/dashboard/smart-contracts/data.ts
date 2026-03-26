import type {
  SmartContractRecord,
  SmartContractStatus,
} from "@/module/dashboard/customers/customer-details/components/contracts/smart-contract-types";

export type SmartContractDashboardRecord = SmartContractRecord & {
  borrowerId: string;
};

type SmartContractMetricBase = {
  title: string;
  trend: string;
  period: string;
};

export type SmartContractMetric = SmartContractMetricBase & {
  value: string;
};

export type SmartContractAutoLiquidationMetric = SmartContractMetricBase & {
  value: number;
};

export type SmartContractMarketAsset = {
  symbol: "BTC" | "ETH" | "ALG";
  name: string;
  price: string;
  change: string;
  tone: "positive" | "negative";
};

export const smartContractMetrics: SmartContractMetric[] = [
  {
    title: "Active Contracts",
    value: "184",
    trend: "99.9%",
    period: "Last 7 days",
  },
  {
    title: "Locked Collateral Value",
    value: "$ 10,543.00",
    trend: "99.9%",
    period: "Last 7 days",
  },
];

export const smartContractAutoLiquidationMetric: SmartContractAutoLiquidationMetric = {
  title: "Auto- Liquidation",
  value: 85,
  trend: "99.9%",
  period: "Last 7 days",
};

export const smartContractMarketAssets: SmartContractMarketAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$2,435.80",
    change: "99.9%",
    tone: "negative",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$1,435.72",
    change: "99.9%",
    tone: "positive",
  },
  {
    symbol: "ALG",
    name: "Algorand",
    price: "$435.24",
    change: "99.9%",
    tone: "positive",
  },
];

const BORROWER_NAMES = [
  "Darryl Simmons",
  "Kristin Watson",
  "Jane Cooper",
  "Brooklyn Simmons",
  "Savannah Nguyen",
] as const;

const COLLATERAL_SYMBOLS = ["BTC", "ETH", "ALG", "USDT", "BTC"] as const;
const PRINCIPAL_AMOUNTS = [6000, 100000, 24000, 2000, 10000] as const;
const COLLATERAL_VALUES = [10000, 150000, 32000, 7000, 50000] as const;
const LTV_VALUES = [57.7, 60.9, 78.2, 82.9, 55.0] as const;
const CONTRACT_STATUSES: SmartContractStatus[] = [
  "pending",
  "active",
  "liquidated",
  "rejected",
  "completed",
];

function getCollateralName(symbol: (typeof COLLATERAL_SYMBOLS)[number]) {
  switch (symbol) {
    case "BTC":
      return "Bitcoin";
    case "ETH":
      return "Ethereum";
    case "ALG":
      return "Algorand";
    default:
      return "Tether";
  }
}

function getLockedCollateralQuantity(symbol: (typeof COLLATERAL_SYMBOLS)[number]) {
  switch (symbol) {
    case "BTC":
      return "1.057 BTC";
    case "ETH":
      return "4.822 ETH";
    case "ALG":
      return "14,520 ALG";
    default:
      return "10,000 USDT";
  }
}

export function createSmartContractRecords(total = 1000): SmartContractDashboardRecord[] {
  return Array.from({ length: total }, (_, index) => {
    const serial = index + 1;
    const status = CONTRACT_STATUSES[index % CONTRACT_STATUSES.length] ?? "pending";
    const collateralSymbol = COLLATERAL_SYMBOLS[index % COLLATERAL_SYMBOLS.length] ?? "BTC";
    const principalAmount = PRINCIPAL_AMOUNTS[index % PRINCIPAL_AMOUNTS.length] ?? 6000;
    const collateralMarketPrice = COLLATERAL_VALUES[index % COLLATERAL_VALUES.length] ?? 10000;
    const ltvPercent = LTV_VALUES[index % LTV_VALUES.length] ?? 60;
    const repaymentAmount = principalAmount + principalAmount * 0.2;
    const liquidationThresholdAmount = repaymentAmount;

    return {
      id: `smart-contract-${serial}`,
      loanId: `CU-${String(8890955421 + serial)}...`,
      borrowerId: `CU-${String(8890955421 + serial)}...`,
      borrowerName: BORROWER_NAMES[index % BORROWER_NAMES.length] ?? BORROWER_NAMES[0],
      borrowerRiskCreditScorePercent: 75 + (index % 9),
      principalAmount,
      durationLabel: "3 Weeks (21 Days)",
      proposedInterestLabel: "$ 19,908.00 (10%)",
      repaymentAmount,
      disbursedDateLabel:
        status === "active" || status === "liquidated" || status === "completed"
          ? "10/01/2026"
          : "-",
      repaymentDueLabel:
        status === "active" || status === "liquidated" || status === "completed"
          ? "05/02/2026"
          : "-",
      collateralSymbol,
      collateralName: getCollateralName(collateralSymbol),
      collateralMarketPrice,
      collateralTrendLabel: "99.9% ▲ Last 7 days",
      contractAddress: `0ex762*****${637999292287 + serial}`,
      contractVerified: status !== "rejected",
      lockedCollateralValue: collateralMarketPrice,
      lockedCollateralQuantityLabel: getLockedCollateralQuantity(collateralSymbol),
      ltvPercent,
      liquidationThresholdPercent: ltvPercent,
      liquidationThresholdAmount,
      currentCollateralValue:
        status === "liquidated"
          ? liquidationThresholdAmount
          : status === "active" && serial % 2 === 0
            ? liquidationThresholdAmount - 1000
            : collateralMarketPrice,
      status,
      rejectionReason: status === "rejected" ? "Asset Collateral Low" : undefined,
    };
  });
}
