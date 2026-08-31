import type { AssetCaseType, AssetPriceType, AssetWeightType } from "./asset-management.type";
import type { ApiResponse, PaginatedApiResponse } from "./global";

export type CustomerAssetStatus = "pending" | "verified" | "rejected" | "notVerified";

export type AssetExaminationType = {
  dateSubmitted: string;
  dateExamined: string;
  hasPhysicalDefects: boolean;
  isBoxPackaged: boolean;
  hasCertificationPapers: boolean;
  examinationOfficerRemark: string;
  examinationOfficerIdentity: string;
};

export type CustomerAssetType = {
  assetId: string;
  status: CustomerAssetStatus;
  price: AssetPriceType;
  assetType: string;
  createdAt: string;
  assetCategoryName: string; // lowercase from API — capitalize at render time
  productionYear: string;
  defectComment: string | null; // ASSUMPTION: also used for rejection reason — see ADR 0020
  uploads: string[];
  isBoxed: boolean;
  hasPapers: boolean;
  case: AssetCaseType | null;
  weight: AssetWeightType | null;
  dialColour: string;
  pawnValuationPrice: AssetPriceType | null;
  assetExamination: AssetExaminationType | null;
  name: string;
  // New fields from the confirmed GET /v1/customers/:id/assets DTO (2026-08-26).
  // Additive only — the customer-details portfolio panel reads the existing fields above.
  updatedAt?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  assetClass?: { assetClassId: string; name: string; assetType?: string } | null;
};

// The Postman sample showed a nested data.assets wrapper, but live testing
// (2026-08-11) confirmed the real endpoint returns a bare array at data,
// matching every other paginated list in this codebase. See ADR 0020.
export type CustomerAssetsResponseType = PaginatedApiResponse<CustomerAssetType[]>;

// ASSUMPTION: defectComment carries both "physical defects" (verify) and
// "rejection reason" (reject) — two separate UI concepts guessing at the same
// unconfirmed field. See ADR 0020.
export type ReviewCustomerAssetPayloadType = {
  status: "verified" | "rejected";
  assetExamination?: {
    dateSubmitted: string;
    dateExamined: string;
    examinationOfficerRemark: string;
    examinationOfficerIdentity: string;
    hasCertificationPapers: boolean;
    isBoxPackaged: boolean;
  };
  pawnValuationPrice?: { value: number; currencyCode: string };
  defectComment?: string;
};

export type ReviewCustomerAssetResponseType = ApiResponse<CustomerAssetType>;
