import { useQuery } from "@tanstack/react-query";
import {
  fetchPortfolioAnalytics,
  fetchPortfolioAssetBrands,
  fetchPortfolioAssetCategories,
  fetchPortfolioAssets,
} from "@/services/client/portfolio.fns";
import keyFactory from "@/util/query-key-factory";

export const usePortfolioAnalytics = () =>
  useQuery({
    queryKey: keyFactory.portfolioManagement.analytics,
    queryFn: fetchPortfolioAnalytics,
  });

export const usePortfolioAssets = (query: string) =>
  useQuery({
    queryKey: keyFactory.portfolioManagement.inventory.list(query),
    queryFn: () => fetchPortfolioAssets(query),
  });

export const usePortfolioAssetBrands = (query: string) =>
  useQuery({
    queryKey: keyFactory.portfolioManagement.brands.list(query),
    queryFn: () => fetchPortfolioAssetBrands(query),
  });

export const usePortfolioAssetCategories = (query: string) =>
  useQuery({
    queryKey: keyFactory.portfolioManagement.categories.list(query),
    queryFn: () => fetchPortfolioAssetCategories(query),
  });
