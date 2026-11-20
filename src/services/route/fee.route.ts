const baseUrl = "/v1/fees";

const FeeRoute = {
  fees: baseUrl,
  options: `${baseUrl}/options`,
  quote: `${baseUrl}/quote`,
  fee: (feeId: string) => `${baseUrl}/${encodeURIComponent(feeId)}`,
  status: (feeId: string) => `${baseUrl}/${encodeURIComponent(feeId)}/status`,
};

export default FeeRoute;
