"use client";

import { ChevronDown, Download, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useURLDateRange } from "@/hooks/useURLDateRange";

type AnalyticsToolbarProps = {
  resetPageOnChange?: boolean;
};

export function AnalyticsToolbar({ resetPageOnChange = true }: AnalyticsToolbarProps) {
  const { range, setRange, resetRange, hasRange } = useURLDateRange({ resetPageOnChange });

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <DatePicker
          mode="range"
          range={range}
          onRangeChange={setRange}
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white text-text-grey"
          numberOfMonths={2}
        />
        {hasRange ? (
          <Button
            type="button"
            variant="ghost"
            className="h-12 w-12 rounded-2xl border border-primary-grey-stroke bg-primary-white p-0 text-text-grey hover:bg-primary-grey-undertone"
            onClick={resetRange}
            aria-label="Reset date range"
          >
            <RotateCcw className="h-4 w-4 text-primary-black" />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
        >
          <Download className="h-4 w-4 text-primary-black" />
          Export
          <ChevronDown className="h-4 w-4 text-text-grey" />
        </Button>
      </div>
    </div>
  );
}
