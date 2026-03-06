"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex w-full gap-2",
        orientation === "vertical" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list flex items-center justify-center gap-1 rounded-xl p-1 text-text-grey group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "w-fit bg-primary-grey-undertone",
        line: "w-full justify-between rounded-2xl bg-primary-grey-undertone p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-transparent px-3 text-sm font-medium text-text-grey transition-colors focus-visible:border-primary-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold-light/20 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "data-active:text-text-black group-data-[variant=default]/tabs-list:data-active:border-primary-grey-stroke group-data-[variant=default]/tabs-list:data-active:bg-primary-white",
        "group-data-[variant=line]/tabs-list:h-14 group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-x-0 group-data-[variant=line]/tabs-list:border-t-0 group-data-[variant=line]/tabs-list:border-b-4 group-data-[variant=line]/tabs-list:border-b-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:px-[6px] group-data-[variant=line]/tabs-list:text-base group-data-[variant=line]/tabs-list:font-medium group-data-[variant=line]/tabs-list:data-active:border-b-primary-black group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:font-semibold group-data-[variant=line]/tabs-list:data-active:text-text-black",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("text-sm flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
