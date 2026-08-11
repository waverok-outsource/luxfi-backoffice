import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import AssetManagementRoute from "@/services/route/asset-management.route";
import type {
  AssetUploadUrlResponseType,
  CreateAssetCategoryPayloadType,
  CreateAssetCategoryResponseType,
  CreateAssetClassPayloadType,
  CreateAssetClassResponseType,
  CreateAssetPayloadType,
  CreateAssetResponseType,
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
    CREATE_ASSET: false,
    UPDATE_ASSET: false,
    DELETE_ASSET: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  // Requests presigned S3 upload URLs for the given files, PUTs each file's
  // bytes directly to its URL, and returns the resulting public fileUrls in
  // the same order as `files`. Uses plain `fetch` (not `apiHandler`) for the
  // PUT step since the presigned URL already carries its own auth/signature
  // in the query string — adding apiHandler's baseURL or Authorization header
  // would misroute or invalidate the request.
  //
  // ASSUMPTION: the response `uploads[]` array is ordered to match the
  // request `files[]` array — there's no explicit correlation key in the
  // sample response. See docs/STATUS.md.
  const uploadAssetImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) {
      return [];
    }

    const { data } = await apiHandler.post<AssetUploadUrlResponseType>(
      AssetManagementRoute.assetsUploadUrl,
      { files: files.map((file) => ({ fileName: file.name, contentType: file.type })) },
    );

    await Promise.all(
      data.data.uploads.map((upload, index) =>
        fetch(upload.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": files[index].type },
          body: files[index],
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to upload ${files[index].name}`);
          }
        }),
      ),
    );

    return data.data.uploads.map((upload) => upload.fileUrl);
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

    createAsset: async (
      payload: Omit<CreateAssetPayloadType, "uploads">,
      files: File[],
      callback?: () => void,
    ) => {
      loadingFn("CREATE_ASSET", true);

      try {
        const uploads = await uploadAssetImages(files);

        await apiHandler.post<CreateAssetResponseType>(AssetManagementRoute.assets, {
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
        const newUploads = await uploadAssetImages(files);

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
