const baseUrl = "/v1";

const AssetManagementRoute = {
  classes: `${baseUrl}/asset-classes`,
  types: `${baseUrl}/asset-classes/types`,
  categories: `${baseUrl}/asset-categories`,
  valuationProviders: `${baseUrl}/asset-valuation-providers`,
  assets: `${baseUrl}/assets`,
  assetsQuickSearch: `${baseUrl}/assets/quick-search`,
  assetsUploadUrl: `${baseUrl}/assets/upload-url`,
  verificationLogs: `${baseUrl}/assets/verification-logs`,
  verificationLog: (logId: string) => `${baseUrl}/assets/verification-logs/${logId}`,
  customerOwnershipAggregates: `${baseUrl}/assets/customer-ownership-aggregates`,
};

export default AssetManagementRoute;
