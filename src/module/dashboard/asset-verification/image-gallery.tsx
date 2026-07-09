"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const placeholderThemes = [
  "from-[#F4E2C8] via-[#D3B58E] to-[#9F6A3B]",
  "from-[#F6E8D9] via-[#D8B58C] to-[#8F6849]",
  "from-[#F1DBC7] via-[#D7BA9D] to-[#7D9E9B]",
  "from-[#EADFF0] via-[#C9B6DE] to-[#8E77A6]",
] as const;

type ImageGalleryProps = {
  images: string[];
  assetName: string;
};

export function ImageGallery({ images, assetName }: ImageGalleryProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const hasRealImages = images.length > 0;
  const tileCount = hasRealImages ? images.length : 3;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: tileCount }, (_, index) => {
          const url = hasRealImages ? images[index] : undefined;

          return (
            <button
              key={url ?? index}
              type="button"
              disabled={!url}
              onClick={() => url && setExpandedIndex(index)}
              className="relative h-20 overflow-hidden rounded-2xl border border-primary-grey-stroke disabled:cursor-default"
            >
              {url ? (
                <Image src={url} alt={assetName} fill unoptimized className="object-cover" />
              ) : (
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br",
                    placeholderThemes[index % placeholderThemes.length],
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_55%)]" />
                  <div className="absolute inset-x-3 bottom-3 rounded-full bg-black/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    {assetName}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {expandedIndex !== null && images[expandedIndex] ? (
        <div
          role="dialog"
          aria-label="Expanded asset image"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setExpandedIndex(null)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-3xl bg-primary-black"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[expandedIndex]}
              alt={assetName}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
