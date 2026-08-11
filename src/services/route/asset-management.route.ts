const baseUrl = "/v1";

const AssetManagementRoute = {
  classes: `${baseUrl}/asset-classes`,
  types: `${baseUrl}/asset-classes/types`,
  categories: `${baseUrl}/asset-categories`,
  valuationProviders: `${baseUrl}/asset-valuation-providers`,
  assets: `${baseUrl}/assets`,
  assetsQuickSearch: `${baseUrl}/assets/quick-search`,
  assetsUploadUrl: `${baseUrl}/assets/upload-url`,
};

export default AssetManagementRoute;
