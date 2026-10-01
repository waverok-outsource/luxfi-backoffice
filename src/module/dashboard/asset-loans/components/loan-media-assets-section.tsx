"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Play, Upload, X } from "lucide-react";

import { LoanCaseCard, LoanCaseSection } from "@/module/dashboard/customers/customer-details/components/shared/loan-case-ui";
import type { LoanMediaType } from "@/types/loan.type";

type LoanMediaAssetsSectionProps = {
  media: LoanMediaType[];
  /** Upload/remove are only offered while the loan is still under review. */
  editable: boolean;
  pending: boolean;
  onAddFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
};

function MediaTile({
  item,
  editable,
  disabled,
  onRemove,
}: {
  item: LoanMediaType;
  editable: boolean;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
        aria-label={`Open ${item.fileName}`}
        title={item.fileName}
      >
        {item.type === "video" ? (
          <>
            <video src={item.url} preload="metadata" muted className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-black/70 text-primary-white">
                <Play className="h-4 w-4" />
              </span>
            </span>
          </>
        ) : (
          <Image src={item.url} alt={item.fileName} fill unoptimized className="object-cover" />
        )}
      </a>

      {editable ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary-black/70 text-primary-white transition hover:bg-primary-black disabled:opacity-50"
          aria-label={`Remove ${item.fileName}`}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function LoanMediaAssetsSection({
  media,
  editable,
  pending,
  onAddFiles,
  onRemove,
}: LoanMediaAssetsSectionProps) {
  return (
    <LoanCaseSection title="Media Assets">
      <LoanCaseCard className="space-y-4">
        <p className="text-xs text-text-grey">
          {editable
            ? "Upload image or video proof of the collateral asset. Files are saved to this loan immediately."
            : "Image and video proof captured during the review of this loan."}
        </p>

        {media.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item, index) => (
              <MediaTile
                key={item.url}
                item={item}
                editable={editable}
                disabled={pending}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        ) : !editable ? (
          <p className="text-sm text-text-grey">No media assets were added for this loan.</p>
        ) : null}

        {editable ? (
          <label
            className={
              pending
                ? "flex cursor-wait items-center justify-between rounded-2xl border border-primary-grey-stroke px-4 py-3 opacity-70"
                : "flex cursor-pointer items-center justify-between rounded-2xl border border-primary-grey-stroke px-4 py-3"
            }
          >
            <span className="text-sm text-text-grey">
              {pending
                ? "Saving media..."
                : media.length
                  ? `${media.length} file${media.length === 1 ? "" : "s"} added. Add more image or video proof`
                  : "No file added. Upload image or video proof"}
            </span>
            <input
              // Remounted after each change so selecting the same file again still fires onChange.
              key={media.length}
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={pending}
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length) onAddFiles(files);
              }}
            />
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin text-text-grey" />
            ) : (
              <Upload className="h-4 w-4 text-text-grey" />
            )}
          </label>
        ) : null}
      </LoanCaseCard>
    </LoanCaseSection>
  );
}
