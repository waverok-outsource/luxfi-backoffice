"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  formatValue?: (value: number) => string;
};

function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
  formatValue = (v) => `${v}%`,
}: SliderProps) {
  const clampedPercentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as number)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <div className="relative pt-9">
        <div
          className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-black px-2 py-1 text-xs font-semibold text-primary-white"
          style={{ left: `${clampedPercentage}%` }}
        >
          {formatValue(value)}
        </div>

        <SliderPrimitive.Control
          data-slot="slider-control"
          className="flex w-full items-center py-2"
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative h-1.5 w-full rounded-full bg-primary-grey-stroke"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-indicator"
              className="h-full rounded-full bg-primary-black"
            />
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              className="block size-5 rounded-full border-2 border-primary-black bg-primary-white shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-black/20 data-disabled:cursor-not-allowed data-disabled:opacity-50"
            />
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </div>
    </SliderPrimitive.Root>
  );
}

export { Slider };
