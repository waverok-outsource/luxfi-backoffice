"use client";

import * as React from "react";
import { Plus, Search, Watch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AssetSearchPopoverProps<TResult> = {
  query: string;
  onQueryChange: (query: string) => void;
  isOpen: boolean;
  results: TResult[];
  getResultKey: (result: TResult) => string;
  renderResult: (result: TResult, onSelect: () => void) => React.ReactNode;
  onSelect: (result: TResult) => void;
  placeholder: string;
  popoverClassName?: string;
};

/**
 * Shared chrome for search-as-you-type asset lookups: debounced input, popover,
 * result list, empty state. Callers own the data source (which endpoint, which
 * result shape) and how each result row renders.
 */
export function AssetSearchPopover<TResult>({
  query,
  onQueryChange,
  isOpen,
  results,
  getResultKey,
  renderResult,
  onSelect,
  placeholder,
  popoverClassName,
}: AssetSearchPopoverProps<TResult>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (result: TResult) => {
    onSelect(result);
    onQueryChange("");
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => (!open ? onQueryChange("") : undefined)}>
      <PopoverTrigger
        render={
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-grey" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={placeholder}
              className="form-control-base form-control-focus h-12 w-full rounded-full border border-primary-grey-stroke bg-primary-white pl-11 pr-4 text-sm text-text-black"
            />
          </div>
        }
      />

      <PopoverContent
        align="start"
        sideOffset={8}
        initialFocus={false}
        finalFocus={inputRef}
        className={cn("max-h-80 w-105 max-w-[90vw] overflow-y-auto p-2", popoverClassName)}
      >
        {results.length ? (
          <ul className="flex flex-col gap-1">
            {results.map((result) => (
              <li key={getResultKey(result)}>{renderResult(result, () => handleSelect(result))}</li>
            ))}
          </ul>
        ) : (
          <p className="p-3 text-center text-sm text-text-grey">No results found</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** Shared row layout — icon avatar, name, a primary line, a badge, and an Add button. */
export function AssetSearchResultRow({
  name,
  primaryLine,
  badgeLabel,
  onSelect,
}: {
  name: string;
  primaryLine: React.ReactNode;
  badgeLabel: string;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-primary-grey-undertone">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-grey-undertone text-text-grey">
          <Watch className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-black">{name}</p>
          <div className="flex items-center gap-2 text-xs text-text-grey">
            <span>{primaryLine}</span>
            <Badge variant="neutral" className="h-5 px-1.5 text-[10px]">
              {badgeLabel}
            </Badge>
          </div>
        </div>
      </div>

      <Button type="button" variant="gold" size="sm" className="shrink-0 rounded-full" onClick={onSelect}>
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>
  );
}
