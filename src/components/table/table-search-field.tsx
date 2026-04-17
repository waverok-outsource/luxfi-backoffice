"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { cn } from "@/lib/utils";

type TableSearchFieldQuery = Record<string, string | undefined>;

type TableSearchFieldProps = {
  placeholder?: string;
  queryKey?: string;
  pageKey?: string;
  debounceMs?: number;
  className?: string;
  inputClassName?: string;
};

export function TableSearchField({
  placeholder = "Search...",
  queryKey = "q",
  pageKey = "page",
  debounceMs = 400,
  className,
  inputClassName,
}: TableSearchFieldProps) {
  const { value, setURLQuery } = useURLQuery<TableSearchFieldQuery>();
  const queryValue = typeof value[queryKey] === "string" ? value[queryKey] : "";
  const [internalValue, setInternalValue] = React.useState(queryValue);
  const debouncedValue = useDebouncedValue(internalValue, debounceMs);

  React.useEffect(() => {
    setInternalValue(queryValue);
  }, [queryValue]);

  React.useEffect(() => {
    if (debouncedValue === queryValue) {
      return;
    }

    setURLQuery({
      [queryKey]: debouncedValue || undefined,
      [pageKey]: "1",
    });
  }, [debouncedValue, pageKey, queryKey, queryValue, setURLQuery]);

  return (
    <div className={cn("w-full", className)}>
      <Input
        placeholder={placeholder}
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        startAdornment={<Search className="h-5 w-5 text-text-grey" />}
        className={inputClassName}
      />
    </div>
  );
}
