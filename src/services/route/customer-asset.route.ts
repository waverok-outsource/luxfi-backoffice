const baseUrl = "/v1";

const CustomerAssetRoute = {
  assets: (customerId: string) => `${baseUrl}/customers/${customerId}/assets`,
  review: (customerId: string, assetId: string) =>
    `${baseUrl}/customers/${customerId}/assets/${assetId}/review`,
};

export default CustomerAssetRoute;
