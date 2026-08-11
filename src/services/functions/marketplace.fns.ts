import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import MarketplaceRoute from "@/services/route/marketplace.route";
import type {
  CreateAssetMarketListingPayloadType,
  CreateAssetMarketListingResponseType,
  ReviewAssetMarketListingPayloadType,
  ReviewAssetMarketListingResponseType,
} from "@/types/marketplace.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

const useMarketplaceFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    CREATE_LISTING: false,
    REVIEW_LISTING: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    createListing: async (payload: CreateAssetMarketListingPayloadType, callback?: () => void) => {
      loadingFn("CREATE_LISTING", true);

      try {
        await apiHandler.post<CreateAssetMarketListingResponseType>(
          MarketplaceRoute.assetMarket,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.marketplace.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_LISTING", false);
      }
    },

    reviewListing: async (
      listingId: string,
      payload: ReviewAssetMarketListingPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("REVIEW_LISTING", true);

      try {
        await apiHandler.patch<ReviewAssetMarketListingResponseType>(
          `${MarketplaceRoute.assetMarket}/${listingId}/review`,
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.marketplace.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REVIEW_LISTING", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useMarketplaceFns;
