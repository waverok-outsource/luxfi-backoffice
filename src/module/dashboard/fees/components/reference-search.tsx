"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ReferenceOption = {
  id: string;
  label: string;
  hint?: string;
};

type ReferenceSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder: string;
  options: ReferenceOption[];
  isLoading?: boolean;
  selected: ReferenceOption[];
  onSelect: (option: ReferenceOption) => void;
  onRemove: (id: string) => void;
  emptyHint?: string;
  manualOption?: ReferenceOption | null;
};

export function ReferenceSearch({
  query,
  onQueryChange,
  placeholder,
  options,
  isLoading = false,
  selected,
  onSelect,
  onRemove,
  emptyHint,
  manualOption,
}: ReferenceSearchProps) {
  const showResults = query.trim().length > 0;
  const selectedIds = new Set(selected.map((item) => item.id));
  const visibleOptions = options.filter((option) => !selectedIds.has(option.id));

  return (
    <div className="space-y-2">
      {selected.length ? (
        <ul className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary-grey-undertone px-3 py-1.5 text-left text-sm text-text-black"
                onClick={() => onRemove(item.id)}
              >
                <span className="truncate">
                  {item.label}
                  {item.hint ? <span className="text-text-grey"> · {item.hint}</span> : null}
                </span>
                <X className="h-3.5 w-3.5 shrink-0 text-text-grey" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        startAdornment={<Search className="h-4 w-4 text-text-grey" />}
      />

      {showResults ? (
        <div className="max-h-56 overflow-y-auto rounded-2xl border border-primary-grey-stroke bg-primary-white">
          {isLoading ? <p className="px-4 py-3 text-sm text-text-grey">Searching...</p> : null}
          {!isLoading && !visibleOptions.length && !manualOption ? (
            <p className="px-4 py-3 text-sm text-text-grey">{emptyHint ?? "No matches"}</p>
          ) : null}
          <ul>
            {visibleOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col items-start px-4 py-2.5 text-left text-sm hover:bg-primary-grey-undertone",
                  )}
                  onClick={() => onSelect(option)}
                >
                  <span className="font-semibold text-text-black">{option.label}</span>
                  {option.hint ? <span className="text-xs text-text-grey">{option.hint}</span> : null}
                </button>
              </li>
            ))}
            {manualOption && !selectedIds.has(manualOption.id) ? (
              <li>
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-4 py-2.5 text-left text-sm hover:bg-primary-grey-undertone"
                  onClick={() => onSelect(manualOption)}
                >
                  <span className="font-semibold text-text-black">{manualOption.label}</span>
                  {manualOption.hint ? (
                    <span className="text-xs text-text-grey">{manualOption.hint}</span>
                  ) : null}
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
