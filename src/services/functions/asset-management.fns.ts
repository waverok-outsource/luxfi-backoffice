import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import AssetManagementRoute from "@/services/route/asset-management.route";
import { uploadFiles } from "@/services/functions/upload-files";
import type {
  CreateAssetBrandPayloadType,
  CreateAssetBrandResponseType,
  CreateAssetCategoryPayloadType,
  CreateAssetCategoryResponseType,
  CreateAssetClassPayloadType,
  CreateAssetClassResponseType,
  CreateAssetPayloadType,
  CreateAssetResponseType,
  CreateAssetV3PayloadType,
  UpdateAssetBrandPayloadType,
  UpdateAssetBrandResponseType,
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
    CREATE_ASSET_BRAND: false,
    UPDATE_ASSET_BRAND: false,
    CREATE_ASSET: false,
    UPDATE_ASSET: false,
    DELETE_ASSET: false,
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

    createAssetBrand: async (payload: CreateAssetBrandPayloadType, callback?: () => void) => {
      loadingFn("CREATE_ASSET_BRAND", true);

      try {
        await apiHandler.post<CreateAssetBrandResponseType>(AssetManagementRoute.brands, payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET_BRAND", false);
      }
    },

    updateAssetBrand: async (
      brandId: string,
      payload: UpdateAssetBrandPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET_BRAND", true);

      try {
        await apiHandler.patch<UpdateAssetBrandResponseType>(
          `${AssetManagementRoute.brands}/${brandId}`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ASSET_BRAND", false);
      }
    },

    createAsset: async (
      payload: Omit<CreateAssetV3PayloadType, "uploads">,
      files: File[],
      callback?: () => void,
    ) => {
      loadingFn("CREATE_ASSET", true);

      try {
        const uploads = await uploadFiles(files);

        await apiHandler.post<CreateAssetResponseType>(AssetManagementRoute.assetsV3, {
          ...payload,
          uploads,
        });

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSET", false);
      }
    },

    // ASSUMPTION: PATCH `/v1/assets/:assetId` follows the classes/categories
    // URL convention — not confirmed by a real sample. See ADR 0003.
    updateAsset: async (
      assetId: string,
      payload: Omit<CreateAssetPayloadType, "uploads">,
      files: File[],
      existingUploads: string[],
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_ASSET", true);

      try {
        const newUploads = await uploadFiles(files);

        await apiHandler.patch<CreateAssetResponseType>(
          `${AssetManagementRoute.assets}/${assetId}`,
          { ...payload, uploads: [...existingUploads, ...newUploads] },
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_ASSET", false);
      }
    },

    // ASSUMPTION: DELETE `/v1/assets/:assetId` follows the classes/categories
    // URL convention — not confirmed by a real sample. See ADR 0003.
    deleteAsset: async (assetId: string, callback?: () => void) => {
      loadingFn("DELETE_ASSET", true);

      try {
        await apiHandler.delete(`${AssetManagementRoute.assets}/${assetId}`);

        await queryClient.invalidateQueries({ queryKey: keyFactory.assetManagement.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("DELETE_ASSET", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useAssetManagementFns;
