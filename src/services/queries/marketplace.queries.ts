import { useQuery } from "@tanstack/react-query";

import { fetchAssetMarketListings } from "@/services/client/marketplace.fns";
import keyFactory from "@/util/query-key-factory";

export const useAssetMarketListings = (query: string) =>
  useQuery({
    queryKey: keyFactory.marketplace.listings.list(query),
    queryFn: () => fetchAssetMarketListings(query),
  });
