"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

import { useURLQuery } from "@/hooks/useUrlQuery";

type DateRangeQuery = Record<"from" | "to" | "page", string | undefined>;

type UseURLDateRangeOptions = {
  resetPageOnChange?: boolean;
};

function parseDateParam(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsedDate = parseISO(value);

  return isValid(parsedDate) ? parsedDate : undefined;
}

function formatDateParam(value: Date | undefined) {
  return value ? format(value, "yyyy-MM-dd") : undefined;
}

export function useURLDateRange(options: UseURLDateRangeOptions = {}) {
  const { resetPageOnChange = true } = options;
  const { value, setURLQuery } = useURLQuery<DateRangeQuery>();
  const hasRange = Boolean(value.from || value.to);

  const range = React.useMemo<DateRange | undefined>(() => {
    const from = parseDateParam(value.from);
    const to = parseDateParam(value.to);

    if (!from && !to) {
      return undefined;
    }

    return {
      from,
      ...(to ? { to } : {}),
    };
  }, [value.from, value.to]);

  const setRange = React.useCallback(
    (nextRange: DateRange | undefined) => {
      setURLQuery({
        from: formatDateParam(nextRange?.from),
        to: formatDateParam(nextRange?.to),
        ...(resetPageOnChange ? { page: "1" } : {}),
      });
    },
    [resetPageOnChange, setURLQuery],
  );

  const resetRange = React.useCallback(() => {
    setURLQuery({
      from: undefined,
      to: undefined,
      ...(resetPageOnChange ? { page: "1" } : {}),
    });
  }, [resetPageOnChange, setURLQuery]);

  return {
    range,
    setRange,
    resetRange,
    hasRange,
  };
}
