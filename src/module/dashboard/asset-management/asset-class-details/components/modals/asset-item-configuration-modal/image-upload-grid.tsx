"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const MAX_UPLOAD_IMAGES = 5;

type ImageEntry = {
  url: string;
  /** Present only for newly-added files, whose blob URL we own and must revoke. */
  isObjectUrl: boolean;
};

export function useAssetItemImages(initialUrls: string[]) {
  const [entries, setEntries] = React.useState<ImageEntry[]>(() =>
    initialUrls.map((url) => ({ url, isObjectUrl: false })),
  );
  const entriesRef = React.useRef(entries);
  React.useEffect(() => {
    entriesRef.current = entries;
  });

  // Object URLs are created once (in addFiles) and revoked once (in removeAt,
  // or here on unmount) — never recomputed from scratch, so an existing
  // preview's URL never changes and the slot-limit check below never sees
  // stale data. The ref (rather than `entries` in the dependency array) keeps
  // this effect a mount/unmount-only cleanup while still revoking whatever is
  // actually current when the component unmounts.
  React.useEffect(() => {
    return () => {
      entriesRef.current.forEach((entry) => {
        if (entry.isObjectUrl) {
          URL.revokeObjectURL(entry.url);
        }
      });
    };
  }, []);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    setEntries((previous) => {
      const availableSlots = Math.max(MAX_UPLOAD_IMAGES - previous.length, 0);

      if (!availableSlots) {
        return previous;
      }

      const newEntries = Array.from(fileList)
        .slice(0, availableSlots)
        .map((file) => ({ url: URL.createObjectURL(file), isObjectUrl: true }));

      return [...previous, ...newEntries];
    });
  };

  const removeAt = (index: number) => {
    setEntries((previous) => {
      const target = previous[index];

      if (target?.isObjectUrl) {
        URL.revokeObjectURL(target.url);
      }

      return previous.filter((_, previousIndex) => previousIndex !== index);
    });
  };

  const urls = entries.map((entry) => entry.url);

  return { urls, addFiles, removeAt };
}

type ImageUploadGridProps = {
  urls: string[];
  onAddFiles: (fileList: FileList | null) => void;
  onRemoveAt: (index: number) => void;
};

export function ImageUploadGrid({ urls, onAddFiles, onRemoveAt }: ImageUploadGridProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (urls.length >= MAX_UPLOAD_IMAGES) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        // Remounted fresh after every successful add instead of reusing the same
        // DOM node + resetting its value — sidesteps browser/file-input quirks
        // where re-triggering the same <input> for a second selection can
        // silently fail to fire another change event.
        key={urls.length}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          onAddFiles(event.target.files);
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: MAX_UPLOAD_IMAGES }, (_, index) => {
          const url = urls[index];

          if (!url) {
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                className="h-[176px] rounded-2xl border border-primary-grey-stroke bg-primary-white p-0 hover:bg-primary-white sm:h-[192px]"
                aria-label={`Upload asset image ${index + 1}`}
                onClick={openFilePicker}
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone)),linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone))] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
                  <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-grey-stroke bg-primary-grey-undertone text-text-grey">
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </Button>
            );
          }

          return (
            <div
              key={url}
              className="relative h-[176px] overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-white sm:h-[192px]"
            >
              <Image src={url} alt="" fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveAt(index)}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-black/70 text-primary-white transition hover:bg-primary-black"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-text-grey">
        {urls.length} of {MAX_UPLOAD_IMAGES} images selected
      </p>
    </div>
  );
}
