import { mockUserAssetPortfolios } from "@/module/dashboard/asset-management/data";
import type { AssetVerificationRecord } from "@/types/asset-verification.type";

export type UserPortfolioDetailsTabValue = "listed-assets" | "activity-log";

type TabConfig = {
  value: UserPortfolioDetailsTabValue;
  label: string;
};

export const userPortfolioDetailsTabs: TabConfig[] = [
  { value: "listed-assets", label: "Listed Assets" },
  { value: "activity-log", label: "Manage Activity Log" },
];

export const DEFAULT_USER_PORTFOLIO_DETAILS_TAB: UserPortfolioDetailsTabValue = "listed-assets";

export type PortfolioActivityLogEntry = {
  logId: string;
  action: string;
  initiatorName: string;
  initiatorRole: string;
  actionDateLabel: string;
  actionTimestampLabel: string;
};

const ASSET_TEMPLATES = [
  {
    assetName: "Rolex Submariner",
    assetCategoryName: "Rolex",
    assetClassName: "Luxury Watches",
    year: "2024",
    dialColour: "Blue",
    weight: "155g",
    caseColour: "Silver",
    caseSize: "41mm",
    marketValue: 13500,
  },
  {
    assetName: "Cartier Santos",
    assetCategoryName: "Cartier",
    assetClassName: "Luxury Watches",
    year: "2022",
    dialColour: "White",
    weight: "120g",
    caseColour: "Steel",
    caseSize: "39mm",
    marketValue: 9800,
  },
  {
    assetName: "Audemars Piguet Royal Oak",
    assetCategoryName: "Audemars Piguet",
    assetClassName: "Luxury Watches",
    year: "2023",
    dialColour: "Blue",
    weight: "155g",
    caseColour: "Steel",
    caseSize: "41mm",
    marketValue: 42000,
  },
  {
    assetName: "Hublot Big Bang",
    assetCategoryName: "Hublot",
    assetClassName: "Luxury Watches",
    year: "2021",
    dialColour: "Black",
    weight: "170g",
    caseColour: "Black",
    caseSize: "44mm",
    marketValue: 21000,
  },
  {
    assetName: "Vacheron Constantin Overseas",
    assetCategoryName: "Vacheron Constantin",
    assetClassName: "Luxury Watches",
    year: "2020",
    dialColour: "Green",
    weight: "140g",
    caseColour: "Rose Gold",
    caseSize: "41mm",
    marketValue: 32000,
  },
] as const;

// Generates a plausible spread of test assets for portfolios that don't have hand-authored data below.
function buildMockPortfolioAssets(portfolioId: string, count: number): AssetVerificationRecord[] {
  return Array.from({ length: count }, (_, index) => {
    const template = ASSET_TEMPLATES[index % ASSET_TEMPLATES.length];
    const isVerified = index % 3 === 0;

    return {
      id: `${portfolioId}-pa-${index + 1}`,
      assetId: `${portfolioId}${String(index + 1).padStart(2, "0")}`,
      assetName: template.assetName,
      assetCategoryName: template.assetCategoryName,
      assetClassName: template.assetClassName,
      year: template.year,
      dialColour: template.dialColour,
      weight: template.weight,
      caseColour: template.caseColour,
      caseSize: template.caseSize,
      dateAddedLabel: "10th Jan, 2026",
      images: [],
      marketValue: template.marketValue,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: Math.round(template.marketValue * 1.05),
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: Math.round(template.marketValue * 0.8),
      loanOfferAmount: isVerified ? Math.round(template.marketValue * 0.7) : null,
      loanOfferAprPercent: isVerified ? 2.5 : null,
      status: isVerified ? "verified" : "pending",
      lastUpdatedAtLabel: isVerified ? "1st Jan, 2026 - 9:00am" : "-",
      submittedDateLabel: isVerified ? "01/01/2026" : "-",
      examinationDateLabel: isVerified ? "01/01/2026" : "-",
      examinationOfficerEmail: isVerified ? "marketing@pawnshopbyblu.com" : "",
      remarks: isVerified ? "Verified in good condition." : "",
      certificationPapersAvailable: isVerified ? true : null,
      boxPackaged: isVerified ? true : null,
      preOwned: isVerified ? false : null,
      anyPhysicalDefects: isVerified ? false : null,
    };
  });
}

// Placeholder data standing in for GET /v1/user-asset-portfolios/:id/assets until the endpoint is available.
const HAND_AUTHORED_PORTFOLIO_ASSETS: Record<string, AssetVerificationRecord[]> = {
  ID12344: [
    {
      id: "pa-1",
      assetId: "1000234",
      assetName: "Rolex Submariner",
      assetCategoryName: "Rolex",
      assetClassName: "Luxury Watches",
      year: "2024",
      dialColour: "Blue",
      weight: "7kg",
      caseColour: "Rose Gold",
      caseSize: "42mm",
      dateAddedLabel: "10th Apr, 2026",
      images: [],
      marketValue: 10000,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: 10500,
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: 8000,
      loanOfferAmount: 7000,
      loanOfferAprPercent: 2.5,
      status: "pending",
      lastUpdatedAtLabel: "-",
      submittedDateLabel: "-",
      examinationDateLabel: "-",
      examinationOfficerEmail: "",
      remarks: "",
      certificationPapersAvailable: null,
      boxPackaged: null,
      preOwned: null,
      anyPhysicalDefects: null,
    },
    {
      id: "pa-2",
      assetId: "1203945",
      assetName: "Rolex Daytona",
      assetCategoryName: "Rolex",
      assetClassName: "Luxury Watches",
      year: "2016",
      dialColour: "Gold",
      weight: "160g",
      caseColour: "Gold",
      caseSize: "40mm",
      dateAddedLabel: "10th Apr, 2026",
      images: [],
      marketValue: 8000,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: 8500,
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: 6500,
      loanOfferAmount: 6000,
      loanOfferAprPercent: 2.5,
      status: "verified",
      lastUpdatedAtLabel: "3rd May, 2026 - 10:23pm",
      submittedDateLabel: "10/04/2026",
      examinationDateLabel: "03/05/2026",
      examinationOfficerEmail: "marketing@pawnshopbyblu.com",
      remarks: "It passed all checks. A little scratch at buckle area.",
      certificationPapersAvailable: true,
      boxPackaged: true,
      preOwned: false,
      anyPhysicalDefects: true,
      proofFileName: "Video-Recording-01524.MOV",
    },
    {
      id: "pa-3",
      assetId: "1037635",
      assetName: "Rolex Datejust",
      assetCategoryName: "Rolex",
      assetClassName: "Luxury Watches",
      year: "2022",
      dialColour: "Green",
      weight: "128g",
      caseColour: "Silver",
      caseSize: "36mm",
      dateAddedLabel: "10th Apr, 2026",
      images: [],
      marketValue: 4908,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: 5100,
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: 4000,
      loanOfferAmount: 3500,
      loanOfferAprPercent: 2.5,
      status: "pending",
      lastUpdatedAtLabel: "-",
      submittedDateLabel: "-",
      examinationDateLabel: "-",
      examinationOfficerEmail: "",
      remarks: "",
      certificationPapersAvailable: null,
      boxPackaged: null,
      preOwned: null,
      anyPhysicalDefects: null,
    },
    {
      id: "pa-4",
      assetId: "1037636",
      assetName: "Rolex Oyster Perpetual",
      assetCategoryName: "Rolex",
      assetClassName: "Luxury Watches",
      year: "2019",
      dialColour: "Grey",
      weight: "132g",
      caseColour: "Gold",
      caseSize: "39mm",
      dateAddedLabel: "10th Apr, 2026",
      images: [],
      marketValue: 2000,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: 2200,
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: 1600,
      loanOfferAmount: 1400,
      loanOfferAprPercent: 2.5,
      status: "pending",
      lastUpdatedAtLabel: "-",
      submittedDateLabel: "-",
      examinationDateLabel: "-",
      examinationOfficerEmail: "",
      remarks: "",
      certificationPapersAvailable: null,
      boxPackaged: null,
      preOwned: null,
      anyPhysicalDefects: null,
    },
    {
      id: "pa-5",
      assetId: "1037637",
      assetName: "Rolex Yacht-Master",
      assetCategoryName: "Rolex",
      assetClassName: "Luxury Watches",
      year: "2026",
      dialColour: "Black",
      weight: "158g",
      caseColour: "Gold",
      caseSize: "40mm",
      dateAddedLabel: "10th Apr, 2026",
      images: [],
      marketValue: 1000,
      marketTrendLabel: "2.2% | Last 24 hrs",
      costBasis: 1100,
      costBasisTrendLabel: "-10% | Last 24 hrs",
      initialLiquidationOffer: 800,
      loanOfferAmount: 700,
      loanOfferAprPercent: 2.5,
      status: "verified",
      lastUpdatedAtLabel: "3rd May, 2026 - 10:23pm",
      submittedDateLabel: "10/04/2026",
      examinationDateLabel: "03/05/2026",
      examinationOfficerEmail: "marketing@pawnshopbyblu.com",
      remarks: "Excellent condition, no defects found.",
      certificationPapersAvailable: true,
      boxPackaged: true,
      preOwned: false,
      anyPhysicalDefects: false,
      proofFileName: "Certificate-Scan-0099.PDF",
    },
  ],
  ID98211: [],
};

export const mockPortfolioAssetsByPortfolioId: Record<string, AssetVerificationRecord[]> = {
  ...HAND_AUTHORED_PORTFOLIO_ASSETS,
  ...Object.fromEntries(
    mockUserAssetPortfolios
      .filter((portfolio) => !(portfolio.portfolioId in HAND_AUTHORED_PORTFOLIO_ASSETS))
      .map((portfolio) => [
        portfolio.portfolioId,
        buildMockPortfolioAssets(portfolio.portfolioId, portfolio.portfolioVolume),
      ]),
  ),
};

// Derives a plausible activity log from a portfolio's own seeded assets (Added + Verified entries),
// so every portfolio that has assets also has a matching, consistent log to test with.
function buildMockActivityLog(portfolioId: string): PortfolioActivityLogEntry[] {
  const assets = mockPortfolioAssetsByPortfolioId[portfolioId] ?? [];

  return assets.flatMap((asset, index) => {
    const entries: PortfolioActivityLogEntry[] = [
      {
        logId: `${portfolioId}-LOG-${String(index * 2 + 1).padStart(3, "0")}`,
        action: "Asset Added",
        initiatorName: "System",
        initiatorRole: "Automated",
        actionDateLabel: "10-01-2026",
        actionTimestampLabel: "12:00 AM",
      },
    ];

    if (asset.status === "verified") {
      entries.push({
        logId: `${portfolioId}-LOG-${String(index * 2 + 2).padStart(3, "0")}`,
        action: "Asset Verified",
        initiatorName: "Marketing Officer",
        initiatorRole: "Compliance Officer",
        actionDateLabel: "01-01-2026",
        actionTimestampLabel: "9:00 AM",
      });
    }

    return entries;
  });
}

const HAND_AUTHORED_ACTIVITY_LOG: Record<string, PortfolioActivityLogEntry[]> = {
  ID12344: [
    {
      logId: "LOG-0001",
      action: "Asset Verified",
      initiatorName: "Marketing Officer",
      initiatorRole: "Compliance Officer",
      actionDateLabel: "03-05-2026",
      actionTimestampLabel: "10:23 AM",
    },
    {
      logId: "LOG-0002",
      action: "Asset Verified",
      initiatorName: "Marketing Officer",
      initiatorRole: "Compliance Officer",
      actionDateLabel: "10-04-2026",
      actionTimestampLabel: "09:15 AM",
    },
    {
      logId: "LOG-0003",
      action: "Asset Added",
      initiatorName: "System",
      initiatorRole: "Automated",
      actionDateLabel: "10-01-2026",
      actionTimestampLabel: "12:00 AM",
    },
  ],
  ID98211: [],
};

export const mockActivityLogByPortfolioId: Record<string, PortfolioActivityLogEntry[]> = {
  ...HAND_AUTHORED_ACTIVITY_LOG,
  ...Object.fromEntries(
    mockUserAssetPortfolios
      .filter((portfolio) => !(portfolio.portfolioId in HAND_AUTHORED_ACTIVITY_LOG))
      .map((portfolio) => [portfolio.portfolioId, buildMockActivityLog(portfolio.portfolioId)]),
  ),
};
