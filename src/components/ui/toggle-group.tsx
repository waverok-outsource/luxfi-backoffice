"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type ToggleGroupLook = "segmented" | "pill";

type ToggleGroupSingleProps = {
  selection: "single";
  value: string;
  onValueChange: (value: string) => void;
};

type ToggleGroupMultipleProps = {
  selection: "multiple";
  value: string[];
  onValueChange: (value: string[]) => void;
};

type ToggleGroupProps = (ToggleGroupSingleProps | ToggleGroupMultipleProps) & {
  look?: ToggleGroupLook;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const ToggleGroupLookContext = React.createContext<ToggleGroupLook>("pill");

function ToggleGroup({ look = "pill", disabled, className, children, ...props }: ToggleGroupProps) {
  const groupValue =
    props.selection === "single" ? (props.value ? [props.value] : []) : props.value;

  const handleValueChange = (nextValue: string[]) => {
    if (props.selection === "single") {
      props.onValueChange(nextValue[0] ?? "");
      return;
    }

    props.onValueChange(nextValue);
  };

  return (
    <ToggleGroupLookContext.Provider value={look}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        value={groupValue}
        onValueChange={handleValueChange}
        multiple={props.selection === "multiple"}
        disabled={disabled}
        className={cn("flex flex-wrap gap-2", className)}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupLookContext.Provider>
  );
}

const toggleGroupItemVariants = cva(
  "inline-flex h-11 items-center justify-center whitespace-nowrap border px-4 text-sm outline-none select-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-black/20 border-[#DEDAD3] bg-white text-text-grey data-pressed:border-[#18181B] data-pressed:bg-[#F8F7F5] data-pressed:font-semibold data-pressed:text-text-black",
  {
    variants: {
      look: {
        pill: "rounded-full",
        segmented: "rounded-xl",
      },
    },
    defaultVariants: {
      look: "pill",
    },
  },
);

type ToggleGroupItemProps = TogglePrimitive.Props<string> &
  VariantProps<typeof toggleGroupItemVariants>;

function ToggleGroupItem({ className, look, ...props }: ToggleGroupItemProps) {
  const contextLook = React.useContext(ToggleGroupLookContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ look: look ?? contextLook }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
