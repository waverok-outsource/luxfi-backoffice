export type AssetVerificationStatus = "pending" | "verified" | "rejected" | "notVerified";

export type AssetVerificationStep = "FORM" | "CONFIRM_STATUS_CHANGE" | "CONFIRM_BLACKLIST" | "RESULT";

export type AssetVerificationRecord = {
  id: string;
  assetId: string;
  assetName: string;
  assetClassName: string;

  year: string;
  dialColour: string;
  weight: string;
  caseColour: string;
  caseSize: string;
  dateAddedLabel: string;

  /** Real thumbnails when available; the gallery falls back to placeholder tiles when empty. */
  images: string[];

  marketValue: number;
  marketTrendLabel: string;
  costBasis: number | null;
  costBasisTrendLabel: string | null;
  initialLiquidationOffer: number | null;
  loanOfferAmount: number | null;
  loanOfferAprPercent: number | null;

  status: AssetVerificationStatus;
  rejectionReason?: string;
  isBlacklisted?: boolean;

  lastUpdatedAtLabel: string;
  submittedDateLabel: string;
  examinationDateLabel: string;
  examinationOfficerEmail: string;
  remarks: string;
  certificationPapersAvailable: boolean | null;
  boxPackaged: boolean | null;
  preOwned: boolean | null;
  anyPhysicalDefects: boolean | null;
  proofFileName?: string;
};

export type AssetVerificationPayload = {
  assetId: string;
  targetStatus: AssetVerificationStatus;
  rejectionReason?: string;
  loanOfferAmount: number | null;
  submittedDateLabel: string;
  examinationDateLabel: string;
  examinationOfficerEmail: string;
  remarks: string;
  certificationPapersAvailable: boolean;
  boxPackaged: boolean;
  preOwned: boolean;
  anyPhysicalDefects: boolean;
  proofFileName?: string;
};

export type BlacklistAssetPayload = {
  assetId: string;
  reason: string;
  notice: string;
};
