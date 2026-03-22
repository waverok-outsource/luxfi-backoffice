import * as React from "react";
import { toast } from "sonner";

export type CopyToClipboardOptions = {
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useCopyToClipboard(defaultOptions?: CopyToClipboardOptions) {
  const defaultOptionsRef = React.useRef<CopyToClipboardOptions | undefined>(defaultOptions);
  const [isCopying, setIsCopying] = React.useState(false);

  React.useEffect(() => {
    defaultOptionsRef.current = defaultOptions;
  }, [defaultOptions]);

  const copy = React.useCallback(async (text: string, options?: CopyToClipboardOptions) => {
    const mergedOptions: CopyToClipboardOptions = {
      showToast: true,
      ...defaultOptionsRef.current,
      ...options,
    };

    if (!text) return false;

    setIsCopying(true);
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard is not available");
      }
      await navigator.clipboard.writeText(text);

      if (mergedOptions.showToast !== false) {
        toast.success(mergedOptions.successMessage ?? "Copied");
      }
      mergedOptions.onSuccess?.();
      return true;
    } catch (error) {
      if (mergedOptions.showToast !== false) {
        toast.error(mergedOptions.errorMessage ?? "Copy failed");
      }
      mergedOptions.onError?.(error);
      return false;
    } finally {
      setIsCopying(false);
    }
  }, []);

  return { copy, isCopying };
}

