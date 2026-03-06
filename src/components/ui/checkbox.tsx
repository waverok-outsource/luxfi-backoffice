"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "flex size-4 items-center justify-center rounded-[4px] border border-[#D0D5DD] bg-primary-white transition-colors",
        "data-checked:border-[#D0D5DD] data-checked:bg-primary-grey-undertone data-checked:text-primary-gold-brand",
        "focus-visible:border-primary-gold-light focus-visible:ring-3 focus-visible:ring-primary-gold-light/25",
        "aria-invalid:border-alert-error aria-invalid:ring-3 aria-invalid:ring-alert-error/25",
        "group-has-disabled/field:opacity-50 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
