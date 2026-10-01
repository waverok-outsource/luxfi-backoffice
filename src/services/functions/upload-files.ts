import apiHandler from "@/services/api-handler";
import AssetManagementRoute from "@/services/route/asset-management.route";
import type { AssetUploadUrlResponseType } from "@/types/asset-management.type";

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
export const uploadFiles = async (files: File[]): Promise<string[]> => {
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
