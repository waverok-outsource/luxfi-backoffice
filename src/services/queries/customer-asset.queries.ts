import { useQuery } from "@tanstack/react-query";

import { fetchCustomerAssets } from "@/services/client/customer-asset.fns";
import keyFactory from "@/util/query-key-factory";

export const useCustomerAssets = (customerId: string, query: string) =>
  useQuery({
    queryKey: keyFactory.customerAssets.list(customerId, query),
    queryFn: () => fetchCustomerAssets(customerId, query),
    enabled: Boolean(customerId),
  });
