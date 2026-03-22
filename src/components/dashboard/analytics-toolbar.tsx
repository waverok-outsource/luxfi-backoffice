"use client";

import type { DateRange } from "react-day-picker";
import { ChevronDown, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";

type AnalyticsToolbarProps = {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  searchPlaceholder?: string;
};

export function AnalyticsToolbar({
  range,
  onRangeChange,
  searchPlaceholder = "Search ...",
}: AnalyticsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full max-w-md">
        <Input
          placeholder={searchPlaceholder}
          startAdornment={<Search className="h-5 w-5 text-text-grey" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DatePicker
          mode="range"
          range={range}
          onRangeChange={onRangeChange}
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white text-text-grey"
          numberOfMonths={2}
        />
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
