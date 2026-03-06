"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarDays, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

type SingleDatePickerProps = {
  mode?: "single";
  date?: Date;
  onDateChange: (value: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

type RangeDatePickerProps = {
  mode: "range";
  range?: DateRange;
  onRangeChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  numberOfMonths?: number;
};

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

export function DatePicker(props: DatePickerProps) {
  const isRange = props.mode === "range";
  const label = React.useMemo(() => {
    if (isRange) {
      const range = props.range;
      if (!range?.from) return props.placeholder ?? "Select date range";
      if (!range.to) return `${format(range.from, "MMMM dd, yyyy")} -`;

      return `${format(range.from, "MMMM dd, yyyy")} - ${format(range.to, "MMMM dd, yyyy")}`;
    }

    return props.date ? format(props.date, "MMMM dd, yyyy") : (props.placeholder ?? "Pick a date");
  }, [isRange, props]);

  const defaultMonth = isRange ? props.range?.from : props.date;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-12 items-center gap-2 rounded-xl bg-primary-white px-4 text-sm text-text-grey",
              props.className,
            )}
          >
            <CalendarDays className="h-5 w-5 text-primary-black" />
            <span className="truncate">{label}</span>
            <ChevronDownIcon data-icon="inline-end" className="h-4 w-4 shrink-0" />
          </button>
        }
      />
      <PopoverContent className="w-auto border border-primary-black/20 bg-primary-white p-0" align="end">
        {isRange ? (
          <Calendar
            mode="range"
            required={false}
            selected={props.range}
            onSelect={props.onRangeChange}
            defaultMonth={defaultMonth}
            numberOfMonths={props.numberOfMonths ?? 2}
          />
        ) : (
          <Calendar
            mode="single"
            required={false}
            selected={props.date}
            onSelect={props.onDateChange}
            defaultMonth={defaultMonth}
            numberOfMonths={1}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
