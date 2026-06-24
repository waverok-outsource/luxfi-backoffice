import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import PortfolioRoute from "@/services/route/portfolio.route";
import type {
  CreatePortfolioAssetPayloadType,
  CreatePortfolioAssetResponseType,
  CreatePortfolioAssetBrandPayloadType,
  CreatePortfolioAssetBrandResponseType,
  CreatePortfolioAssetCategoryPayloadType,
  CreatePortfolioAssetCategoryResponseType,
  UpdatePortfolioAssetBrandPayloadType,
  UpdatePortfolioAssetBrandResponseType,
  UpdatePortfolioAssetCategoryPayloadType,
  UpdatePortfolioAssetCategoryResponseType,
} from "@/types/portfolio.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const usePortfolioFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_ASSET: false,
    CREATE_ASSET_BRAND: false,
    UPDATE_ASSET_BRAND: false,
    CREATE_ASSET_CATEGORY: false,
    UPDATE_ASSET_CATEGORY: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    createAsset: async (
      payload: CreatePortfolioAssetPayloadType,
      files: File[],
      callback?: () => void,
    ) => {
      loadingFn("CREATE_ASSET", true);

      try {
        const formData = new FormData();

        files.forEach((file) => {
          formData.append("files", file);
        });

        formData.append("name", payload.name);
        formData.append("status", payload.status);
        formData.append("brand", payload.brand);
        formData.append("category", payload.category);
        formData.append("condition", payload.condition);
        formData.append("productionYear", payload.productionYear);
        formData.append("price", String(payload.price));
        formData.append("currencyCode", payload.currencyCode);
        formData.append("hasPapers", String(payload.hasPapers));
        formData.append("isBoxed", String(payload.isBoxed));
        formData.append("caseColour", payload.caseColour);
        formData.append("caseSize", String(payload.caseSize));
        formData.append("weight", String(payload.weight));
        formData.append("dialColour", payload.dialColour);

        await apiHandler.post<CreatePortfolioAssetResponseType>(PortfolioRoute.assets, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await queryClient.invalidateQueries({ queryKey: keyFactory.portfolioManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET", false);
      }
    },

    createAssetBrand: async (
      payload: CreatePortfolioAssetBrandPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("CREATE_ASSET_BRAND", true);

      try {
        await apiHandler.post<CreatePortfolioAssetBrandResponseType>(PortfolioRoute.assetBrands, payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.portfolioManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET_BRAND", false);
      }
    },

    updateAssetBrand: async (
      brandId: string,
      payload: UpdatePortfolioAssetBrandPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET_BRAND", true);

      try {
        await apiHandler.patch<UpdatePortfolioAssetBrandResponseType>(
          `${PortfolioRoute.assetBrands}/${brandId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.portfolioManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ASSET_BRAND", false);
      }
    },

    createAssetCategory: async (
      payload: CreatePortfolioAssetCategoryPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("CREATE_ASSET_CATEGORY", true);

      try {
        await apiHandler.post<CreatePortfolioAssetCategoryResponseType>(
          PortfolioRoute.assetCategories,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.portfolioManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET_CATEGORY", false);
      }
    },

    updateAssetCategory: async (
      categoryId: string,
      payload: UpdatePortfolioAssetCategoryPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET_CATEGORY", true);

      try {
        await apiHandler.patch<UpdatePortfolioAssetCategoryResponseType>(
          `${PortfolioRoute.assetCategories}/${categoryId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.portfolioManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ASSET_CATEGORY", false);
      }
    },
  };

  return { ...fns, loading };
};

export default usePortfolioFns;
