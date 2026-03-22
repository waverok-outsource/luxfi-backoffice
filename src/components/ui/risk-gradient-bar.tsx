"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const BAR_SEGMENTS = [
  {
    barClassName: "bg-alert-success",
    markerBackgroundClassName: "bg-alertSoft-success",
    markerTextClassName: "text-text-green",
  },
  {
    barClassName: "bg-alert-warning",
    markerBackgroundClassName: "bg-alertSoft-warning",
    markerTextClassName: "text-text-amber",
  },
  {
    barClassName: "bg-[#FF9E42]",
    markerBackgroundClassName: "bg-alertSoft-caution",
    markerTextClassName: "text-text-orange",
  },
  {
    barClassName: "bg-alert-error",
    markerBackgroundClassName: "bg-alertSoft-error",
    markerTextClassName: "text-text-red",
  },
] as const;

export type RiskGradientBarVariant = "success" | "warning" | "error";
export type RiskGradientBarColorMode = "variant" | "segment";
export type RiskGradientBarMarkerTone = {
  backgroundClassName: string;
  textClassName: string;
};

const VARIANT_CLASSES: Record<RiskGradientBarVariant, RiskGradientBarMarkerTone> = {
  success: {
    backgroundClassName: "bg-alertSoft-success",
    textClassName: "text-text-green",
  },
  warning: {
    backgroundClassName: "bg-alertSoft-warning",
    textClassName: "text-text-amber",
  },
  error: {
    backgroundClassName: "bg-alertSoft-error",
    textClassName: "text-text-red",
  },
};

type RiskGradientBarProps = {
  position: number;
  variant: RiskGradientBarVariant;
  markerContent: React.ReactNode | ((tone: RiskGradientBarMarkerTone) => React.ReactNode);
  labels: readonly [string, string, string, string];
  size?: "sm" | "md";
  title?: string;
  colorMode?: RiskGradientBarColorMode;
};

export function RiskGradientBar({
  position,
  variant,
  markerContent,
  labels,
  size = "md",
  title,
  colorMode = "variant",
}: RiskGradientBarProps) {
  const clampedPosition = Math.max(0, Math.min(100, position));
  const isCompact = size === "sm";
  const activeSegmentIndex = Math.min(
    BAR_SEGMENTS.length - 1,
    Math.floor(clampedPosition / (100 / BAR_SEGMENTS.length)),
  );
  const markerTone =
    colorMode === "segment"
      ? {
          backgroundClassName: BAR_SEGMENTS[activeSegmentIndex].markerBackgroundClassName,
          textClassName: BAR_SEGMENTS[activeSegmentIndex].markerTextClassName,
        }
      : VARIANT_CLASSES[variant];

  const bar = (
    <div
      className={cn(
        "rounded-2xl bg-primary-grey-undertone",
        isCompact ? "w-full max-w-[483px] p-5" : "p-4",
      )}
    >
      <div className={cn("relative", isCompact ? "pt-11" : "pt-14")}>
        <div
          className="absolute left-0 top-0 z-10 -translate-x-1/2"
          style={{ left: `${clampedPosition}%` }}
          aria-label={typeof markerContent === "string" ? markerContent : undefined}
        >
          <div className="relative">
            <div
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold shadow-sm",
                markerTone.backgroundClassName,
                markerTone.textClassName,
              )}
            >
              {typeof markerContent === "function" ? markerContent(markerTone) : markerContent}
            </div>
            <div
              className={cn(
                "absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px]",
                markerTone.backgroundClassName,
              )}
            />
          </div>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full">
          {BAR_SEGMENTS.map((segment) => (
            <div key={segment.barClassName} className={cn("w-1/4", segment.barClassName)} />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 text-xs font-semibold text-text-black">
        <span>{labels[0]}</span>
        <span className="text-center">{labels[1]}</span>
        <span className="text-center">{labels[2]}</span>
        <span className="text-right">{labels[3]}</span>
      </div>
    </div>
  );

  if (title) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-grey">{title}</p>
        {bar}
      </div>
    );
  }

  return bar;
}
