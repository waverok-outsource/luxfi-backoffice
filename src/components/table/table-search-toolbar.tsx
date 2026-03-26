"use client";

import { ChevronDown, Search } from "lucide-react";

import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TableSearchToolbarProps = {
  placeholder?: string;
  queryKey?: string;
};

export function TableSearchToolbar({
  placeholder = "Search user name or ID",
  queryKey = "search",
}: TableSearchToolbarProps) {
  const { search, setSearch } = useURLTableSearch(queryKey);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-full max-w-md">
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          startAdornment={<Search className="h-5 w-5 text-text-grey" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
        >
          Filter Options
          <ChevronDown className="h-4 w-4 text-text-grey" />
        </Button>
      </div>
    </div>
  );
}
