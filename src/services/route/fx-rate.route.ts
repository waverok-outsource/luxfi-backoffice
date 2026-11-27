const baseUrl = "/v1/fx-rates";

const FxRateRoute = {
  rates: baseUrl,
  history: `${baseUrl}/history`,
  quote: `${baseUrl}/quote`,
};

export default FxRateRoute;
