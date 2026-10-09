import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import apiHandler from "@/services/api-handler";
import LoanRoute from "@/services/route/loan.route";
import type { AssetUploadUrlResponseType } from "@/types/asset-management.type";
import type {
  ApproveLoanPayloadType,
  LoanMediaKind,
  LoanMediaType,
  RejectLoanPayloadType,
  ReviewLoanResponseType,
  SaveCollateralVerificationPayloadType,
  UpdateApprovedAmountPayloadType,
  UpdateCollateralVerificationPayloadType,
} from "@/types/loan.type";
import getErrorMessage from "@/util/get-error-message";
import keyFactory from "@/util/query-key-factory";

function contentTypeFor(file: File) {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function mediaKindFor(contentType: string): LoanMediaKind {
  return contentType.startsWith("video/") ? "video" : "image";
}

const useLoanFns = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({
    REJECT_LOAN: false,
    APPROVE_LOAN: false,
    UPDATE_LOAN_MEDIA: false,
    UPDATE_COLLATERAL_VERIFICATION: false,
    UPDATE_APPROVED_AMOUNT: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    rejectLoan: async (loanRef: string, payload: RejectLoanPayloadType, callback?: () => void) => {
      loadingFn("REJECT_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.reject(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("REJECT_LOAN", false);
      }
    },

    approveLoan: async (
      loanRef: string,
      payload: ApproveLoanPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("APPROVE_LOAN", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(LoanRoute.approve(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });

        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("APPROVE_LOAN", false);
      }
    },

    // Step 1: presigned URLs. Step 2: PUT bytes to each URL. Step 3: save the file URLs on the loan.
    uploadCollateralVerification: async (
      loanRef: string,
      files: File[],
      callback?: (media: LoanMediaType[]) => void,
    ) => {
      if (!files.length) return false;

      loadingFn("UPDATE_LOAN_MEDIA", true);

      try {
        const { data } = await apiHandler.post<AssetUploadUrlResponseType>(
          LoanRoute.collateralVerificationUploadUrl(loanRef),
          {
            files: files.map((file) => ({
              fileName: file.name,
              contentType: contentTypeFor(file),
            })),
          },
        );

        const uploads = data.data.uploads;
        if (uploads.length !== files.length) {
          throw new Error("Upload URL response did not match the selected files");
        }

        await Promise.all(
          uploads.map((upload, index) =>
            fetch(upload.uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": contentTypeFor(files[index]) },
              body: files[index],
            }).then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to upload ${files[index].name}`);
              }
            }),
          ),
        );

        const payload: SaveCollateralVerificationPayloadType = {
          files: uploads.map((upload) => ({
            fileUrl: upload.fileUrl,
            fileName: upload.fileName,
          })),
        };
        await apiHandler.post(LoanRoute.collateralVerification(loanRef), payload);

        const uploadedAt = new Date().toISOString();
        const media: LoanMediaType[] = uploads.map((upload, index) => ({
          url: upload.fileUrl,
          type: mediaKindFor(contentTypeFor(files[index])),
          fileName: upload.fileName || files[index].name,
          uploadedAt,
        }));

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });
        toast.success("Verification media uploaded");
        callback?.(media);
        return true;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
        return false;
      } finally {
        loadingFn("UPDATE_LOAN_MEDIA", false);
      }
    },

    updateCollateralVerification: async (
      loanRef: string,
      payload: UpdateCollateralVerificationPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_COLLATERAL_VERIFICATION", true);

      try {
        await apiHandler.patch<ReviewLoanResponseType>(
          LoanRoute.collateralVerification(loanRef),
          payload,
        );

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });
        toast.success("Collateral verification saved");
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_COLLATERAL_VERIFICATION", false);
      }
    },

    updateApprovedAmount: async (
      loanRef: string,
      payload: UpdateApprovedAmountPayloadType,
      callback?: () => void,
    ) => {
      loadingFn("UPDATE_APPROVED_AMOUNT", true);

      try {
        await apiHandler.post<ReviewLoanResponseType>(LoanRoute.approvedAmount(loanRef), payload);

        await queryClient.invalidateQueries({ queryKey: keyFactory.loans.all });
        toast.success("Approved amount updated");
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("UPDATE_APPROVED_AMOUNT", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useLoanFns;
