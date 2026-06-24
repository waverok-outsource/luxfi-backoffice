import { ApiResponse, PaginatedApiResponse } from "./global";

export type PortfolioAnalyticsGrowthPattern = "upward" | "downward";

export type PortfolioAnalyticsMetricType = {
  value: number;
  growth: string;
  growthDuration: string;
  growthPattern: PortfolioAnalyticsGrowthPattern;
};

export type PortfolioAssetCountAnalyticsType = PortfolioAnalyticsMetricType & {
  online: number;
  offline: number;
};

export type PortfolioAssetValueAnalyticsType = PortfolioAnalyticsMetricType & {
  currencyCode: string;
};

export type PortfolioAnalyticsType = {
  assetCount: PortfolioAssetCountAnalyticsType;
  assetValue: PortfolioAssetValueAnalyticsType;
  assetCategories: PortfolioAnalyticsMetricType;
  publishedAsset: PortfolioAnalyticsMetricType;
  unpublishedAsset: PortfolioAnalyticsMetricType;
};

export type PortfolioAnalyticsResponseType = ApiResponse<PortfolioAnalyticsType>;

export type PortfolioInventoryAssetType = {
  status: string;
  ownerType: string;
  ownerId: string;
  uploads: string[];
  price: number;
  currencyCode: string;
  productionYear: string;
  hasPapers: boolean;
  isBoxed: boolean;
  caseColour: string;
  weight: number;
  dialColour: string;
  assetId: string;
  createdAt: string;
  assetRef: string;
  categoryName: string;
  categoryId: string;
  defectComment: string | null;
  watchChartId: string | null;
  verificationStatus: string;
  onSale: boolean;
  assetName?: string;
  name?: string;
  brandName?: string;
  assetBrand?: string;
};

export type PortfolioInventoryAssetsResponseType = PaginatedApiResponse<PortfolioInventoryAssetType[]>;

export type PortfolioAssetPublishStatus = "draft" | "published";

export type CreatePortfolioAssetPayloadType = {
  name: string;
  status: PortfolioAssetPublishStatus;
  brand: string;
  category: string;
  condition: string;
  productionYear: string;
  price: number;
  currencyCode: string;
  hasPapers: boolean;
  isBoxed: boolean;
  caseColour: string;
  caseSize: number;
  weight: number;
  dialColour: string;
};

export type CreatePortfolioAssetResponseType = ApiResponse<PortfolioInventoryAssetType>;

export type PortfolioAssetBrandType = {
  status: string;
  name: string;
  assetsCount: number;
  brandId: string;
  createdAt: string;
  categoryName: string;
  categoryRef: string;
  categoryId: string;
  brandRef: string;
};

export type PortfolioAssetBrandsResponseType = PaginatedApiResponse<PortfolioAssetBrandType[]>;

export type CreatePortfolioAssetBrandPayloadType = {
  name: string;
  category: string;
};

export type CreatePortfolioAssetBrandResponseType = ApiResponse<PortfolioAssetBrandType>;

export type UpdatePortfolioAssetBrandPayloadType = {
  name: string;
  category: string;
  status: "draft" | "published";
};

export type UpdatePortfolioAssetBrandResponseType = ApiResponse<PortfolioAssetBrandType>;

export type PortfolioAssetCategoryType = {
  status: string;
  name: string;
  brandsCount: number;
  assetsCount: number;
  categoryId: string;
  createdAt: string;
  categoryRef: string;
};

export type PortfolioAssetCategoriesResponseType = PaginatedApiResponse<PortfolioAssetCategoryType[]>;

export type PortfolioAssetCategoryStatus = "draft" | "published";

export type CreatePortfolioAssetCategoryPayloadType = {
  name: string;
  status: PortfolioAssetCategoryStatus;
};

export type CreatePortfolioAssetCategoryResponseType = ApiResponse<PortfolioAssetCategoryType>;

export type UpdatePortfolioAssetCategoryPayloadType = {
  status: PortfolioAssetCategoryStatus;
  name?: string;
};

export type UpdatePortfolioAssetCategoryResponseType = ApiResponse<PortfolioAssetCategoryType>;
