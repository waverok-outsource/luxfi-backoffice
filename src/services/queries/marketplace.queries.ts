import { useQuery } from "@tanstack/react-query";

import { fetchAssetMarketListings, fetchOrderById, fetchOrders } from "@/services/client/marketplace.fns";
import keyFactory from "@/util/query-key-factory";

export const useAssetMarketListings = (query: string) =>
  useQuery({
    queryKey: keyFactory.marketplace.listings.list(query),
    queryFn: () => fetchAssetMarketListings(query),
  });

export const useOrders = (query: string) =>
  useQuery({
    queryKey: keyFactory.marketplace.orders.list(query),
    queryFn: () => fetchOrders(query),
  });

export const useOrderById = (orderId: string) =>
  useQuery({
    queryKey: keyFactory.marketplace.orders.details(orderId),
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
  });
