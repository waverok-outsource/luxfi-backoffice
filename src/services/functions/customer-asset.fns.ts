import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import CustomerAssetRoute from "@/services/route/customer-asset.route";
import type {
  ReviewCustomerAssetPayloadType,
  ReviewCustomerAssetResponseType,
} from "@/types/customer-asset.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useCustomerAssetFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({ REVIEW_ASSET: false });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    reviewAsset: async (
      customerId: string,
      assetId: string,
      payload: ReviewCustomerAssetPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("REVIEW_ASSET", true);

      try {
        await apiHandler.patch<ReviewCustomerAssetResponseType>(
          CustomerAssetRoute.review(customerId, assetId),
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.customerAssets.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REVIEW_ASSET", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useCustomerAssetFns;
