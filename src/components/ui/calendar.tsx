"use client";

import * as React from "react";
import { DayPicker, getDefaultClassNames, type DayButton, type Locale } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "outline",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-2 [--cell-radius:14px] [--cell-size:2.4rem] bg-primary-white group/calendar in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-2 md:flex-row", defaultClassNames.months),
        month: cn("flex w-fit flex-col gap-2", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between px-0.5",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-8 rounded-full aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-8 rounded-full aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-9",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-8 w-full items-center justify-center gap-1 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative cn-calendar-dropdown-root rounded-(--cell-radius)",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none text-base font-semibold text-text-black",
          captionLayout === "label"
            ? ""
            : "cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-sm [&>svg]:size-3.5 [&>svg]:text-text-grey",
          defaultClassNames.caption_label,
        ),
        table: "w-fit border-collapse",
        weekdays: cn("flex w-fit", defaultClassNames.weekdays),
        weekday: cn(
          "flex h-7 w-(--cell-size) items-center justify-center select-none rounded-(--cell-radius) text-xs font-medium text-text-grey",
          defaultClassNames.weekday,
        ),
        week: cn("mt-0.5 flex w-fit", defaultClassNames.week),
        week_number_header: cn("select-none w-(--cell-size)", defaultClassNames.week_number_header),
        week_number: cn("select-none text-xs text-text-grey", defaultClassNames.week_number),
        day: cn(
          "group/day relative h-(--cell-size) w-(--cell-size) select-none p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) after:absolute after:inset-y-0 after:right-0 after:w-1/2 after:bg-primary-grey-stroke/40",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none bg-primary-grey-stroke/40", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:bg-primary-grey-stroke/40",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-(--cell-radius) border border-primary-grey-stroke text-text-black data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn("text-text-grey/45 aria-selected:text-text-grey/45", defaultClassNames.outside),
        disabled: cn("text-text-grey opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("cn-rtl-flip size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("cn-rtl-flip size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: ({ ...props }) => <CalendarDayButton locale={locale} {...props} />,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      variant="outline"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex h-(--cell-size) w-(--cell-size) items-center justify-center rounded-(--cell-radius) border-0 bg-transparent text-sm leading-none font-normal text-text-black hover:bg-primary-grey-undertone group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-primary-black/10 data-[selected-single=true]:bg-primary-grey-stroke data-[selected-single=true]:text-text-black data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-text-black data-[range-middle=true]:hover:bg-transparent data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary-grey-stroke data-[range-start=true]:text-text-black data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary-grey-stroke data-[range-end=true]:text-text-black [&>span]:text-[10px] [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
