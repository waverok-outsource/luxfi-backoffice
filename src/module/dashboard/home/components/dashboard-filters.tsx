"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useURLDateRange } from "@/hooks/useURLDateRange";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function DashboardFilters() {
  const [showBalances, setShowBalances] = useState(true);
  const { range, setRange, resetRange, hasRange } = useURLDateRange({
    resetPageOnChange: false,
  });

  return (
    <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-primary-white px-4 py-2 text-sm text-text-grey">
          <Switch
            checked={showBalances}
            onCheckedChange={(value) => setShowBalances(Boolean(value))}
            aria-label="Toggle balance visibility"
            size="sm"
          />
          <span>{showBalances ? "Show Balances" : "Hide Balances"}</span>
        </div>
        <DatePicker
          mode="range"
          range={range}
          onRangeChange={setRange}
          className=" justify-start"
          numberOfMonths={2}
        />
        {hasRange ? (
          <Button
            type="button"
            variant="gold"
            className="h-12 w-12 rounded-xl p-0"
            onClick={resetRange}
            aria-label="Reset date range"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        ) : null}
        <Button variant="default" className="h-auto rounded-xl px-6">
          Export CSV
        </Button>
      </div>
    </div>
  );
}
