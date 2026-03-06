"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export function DashboardFilters() {
  const [showBalances, setShowBalances] = useState(true);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 6, 20),
  });

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="w-full max-w-md">
        <Input
          placeholder="Search ..."
          startAdornment={<Search className="h-4 w-4 text-[#1d2742]" />}
          className="rounded-3xl border-[#d0d0d0] bg-primary-white"
        />
      </div>

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
        <Button variant="gold" className="rounded-xl w-12" aria-label="Refresh data">
          <RefreshCw className="h-10 w-10" />
        </Button>
        <Button variant="default" className="h-auto rounded-xl px-6">
          Export CSV
        </Button>
      </div>
    </div>
  );
}
