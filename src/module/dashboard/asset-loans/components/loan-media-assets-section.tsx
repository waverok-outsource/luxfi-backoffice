"use client";

import * as React from "react";
import Image from "next/image";
import { Film, Loader2, Play, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LoanMediaType } from "@/types/loan.type";

export const MAX_VERIFICATION_MEDIA = 5;

let pendingMediaId = 0;

function nextPendingMediaId(file: File) {
  pendingMediaId += 1;
  return `${file.name}-${file.size}-${file.lastModified}-${pendingMediaId}`;
}

type PendingMedia = {
  id: string;
  file: File;
  url: string;
};

type LoanMediaAssetsSectionProps = {
  media: LoanMediaType[];
  /** Selection and upload are only offered while the loan is still under review. */
  editable: boolean;
  pending: boolean;
  onUpload: (files: File[]) => Promise<boolean>;
};

const checkerboardClassName =
  "absolute inset-0 bg-[linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone)),linear-gradient(45deg,var(--color-primary-grey-undertone)_25%,transparent_25%,transparent_75%,var(--color-primary-grey-undertone)_75%,var(--color-primary-grey-undertone))] bg-[length:20px_20px] bg-[position:0_0,10px_10px]";

function MediaPreview({ item }: { item: LoanMediaType }) {
  if (item.type === "video") {
    return (
      <>
        <video src={item.url} preload="metadata" muted className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-black/70 text-primary-white">
            <Play className="h-4 w-4" />
          </span>
        </span>
      </>
    );
  }

  return <Image src={item.url} alt={item.fileName} fill unoptimized className="object-cover" />;
}

function FilledMediaCard({
  item,
  onRemove,
}: {
  item: LoanMediaType;
  onRemove?: () => void;
}) {
  return (
    <div className="relative h-[176px] overflow-hidden rounded-2xl border border-primary-grey-stroke bg-primary-white sm:h-[192px]">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
        aria-label={`Open ${item.fileName}`}
        title={item.fileName}
      >
        <MediaPreview item={item} />
      </a>
      <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-primary-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-white">
        {item.type === "video" ? <Film className="h-3 w-3" /> : null}
        {item.type}
      </span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-black/70 text-primary-white transition hover:bg-primary-black"
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
  onUpload,
}: LoanMediaAssetsSectionProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = React.useState<PendingMedia[]>([]);
  const selectedRef = React.useRef(selected);

  React.useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  React.useEffect(() => {
    return () => {
      selectedRef.current.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, []);

  const usedCount = media.length + selected.length;
  const canAdd = editable && usedCount < MAX_VERIFICATION_MEDIA && !pending;
  const emptySlots = editable ? Math.max(MAX_VERIFICATION_MEDIA - usedCount, 0) : 0;

  const openFilePicker = () => {
    if (!canAdd) return;
    inputRef.current?.click();
  };

  const addFiles = (fileList: FileList | null) => {
    const available = MAX_VERIFICATION_MEDIA - media.length - selected.length;
    const next = Array.from(fileList ?? []).slice(0, Math.max(available, 0));
    if (!next.length) return;

    setSelected((current) => [
      ...current,
      ...next.map((file) => ({
        id: nextPendingMediaId(file),
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeSelected = (id: string) => {
    setSelected((current) => {
      const target = current.find((entry) => entry.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((entry) => entry.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!selected.length || pending) return;
    const uploaded = await onUpload(selected.map((entry) => entry.file));
    if (!uploaded) return;
    setSelected((current) => {
      current.forEach((entry) => URL.revokeObjectURL(entry.url));
      return [];
    });
  };

  if (!editable && media.length === 0) {
    return <p className="text-sm text-text-grey">No image or video proof was added for this loan.</p>;
  }

  return (
    <div className="space-y-3">
      <input
        key={usedCount}
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        disabled={!canAdd}
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {media.map((item) => (
          <FilledMediaCard key={item.url} item={item} />
        ))}
        {selected.map((entry) => (
          <FilledMediaCard
            key={entry.id}
            item={{
              url: entry.url,
              fileName: entry.file.name,
              type: entry.file.type.startsWith("video/") ? "video" : "image",
            }}
            onRemove={pending ? undefined : () => removeSelected(entry.id)}
          />
        ))}
        {Array.from({ length: emptySlots }, (_, index) => (
          <Button
            key={`empty-${index}`}
            type="button"
            variant="ghost"
            disabled={!canAdd}
            className="h-[176px] rounded-2xl border border-primary-grey-stroke bg-primary-white p-0 hover:bg-primary-white sm:h-[192px]"
            aria-label={`Select asset image or video ${usedCount + index + 1}`}
            onClick={openFilePicker}
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
              <div className={checkerboardClassName} />
              <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-grey-stroke bg-primary-grey-undertone text-text-grey">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-grey">
          {pending
            ? "Uploading media..."
            : editable
              ? selected.length
                ? `${selected.length} file${selected.length === 1 ? "" : "s"} ready to upload.`
                : `${media.length} of ${MAX_VERIFICATION_MEDIA} files saved. Choose a card to select an image or video.`
              : `${media.length} file${media.length === 1 ? "" : "s"} attached during review.`}
        </p>
        {editable ? (
          <Button type="button" disabled={!selected.length || pending} pending={pending} onClick={handleUpload}>
            Upload
          </Button>
        ) : null}
      </div>
    </div>
  );
}
