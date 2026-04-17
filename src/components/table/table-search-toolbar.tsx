"use client";

import { ChevronDown } from "lucide-react";

import { TableSearchField } from "@/components/table/table-search-field";
import { Button } from "@/components/ui/button";

type TableSearchToolbarProps = {
  placeholder?: string;
  queryKey?: string;
};

export function TableSearchToolbar({
  placeholder = "Search user name or ID",
  queryKey = "q",
}: TableSearchToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <TableSearchField placeholder={placeholder} queryKey={queryKey} className="max-w-md" />

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
