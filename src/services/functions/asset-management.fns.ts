import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import AssetManagementRoute from "@/services/route/asset-management.route";
import type {
  CreateAssetCategoryPayloadType,
  CreateAssetCategoryResponseType,
  CreateAssetClassPayloadType,
  CreateAssetClassResponseType,
  UpdateAssetCategoryPayloadType,
  UpdateAssetCategoryResponseType,
} from "@/types/asset-management.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useAssetManagementFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_ASSET_CLASS: false,
    UPDATE_ASSET_CLASS: false,
    CREATE_ASSET_CATEGORY: false,
    UPDATE_ASSET_CATEGORY: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    createAssetClass: async (payload: CreateAssetClassPayloadType, callback?: () => void) => {
      loadingFn("CREATE_ASSET_CLASS", true);

      try {
        await apiHandler.post<CreateAssetClassResponseType>(AssetManagementRoute.classes, payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET_CLASS", false);
      }
    },

    updateAssetClass: async (
      classId: string,
      payload: CreateAssetClassPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET_CLASS", true);

      try {
        await apiHandler.patch<CreateAssetClassResponseType>(
          `${AssetManagementRoute.classes}/${classId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ASSET_CLASS", false);
      }
    },

    createAssetCategory: async (payload: CreateAssetCategoryPayloadType, callback?: () => void) => {
      loadingFn("CREATE_ASSET_CATEGORY", true);

      try {
        await apiHandler.post<CreateAssetCategoryResponseType>(
          AssetManagementRoute.categories,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET_CATEGORY", false);
      }
    },

    updateAssetCategory: async (
      categoryId: string,
      payload: UpdateAssetCategoryPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET_CATEGORY", true);

      try {
        await apiHandler.patch<UpdateAssetCategoryResponseType>(
          `${AssetManagementRoute.categories}/${categoryId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

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

export default useAssetManagementFns;
