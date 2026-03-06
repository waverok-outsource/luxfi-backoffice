"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "shrink-0 rounded-full border border-transparent outline-none transition-all peer group/switch relative inline-flex items-center data-disabled:cursor-not-allowed data-disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-black/20 data-checked:bg-primary-black data-unchecked:bg-primary-grey-stroke data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-[22px] data-[size=sm]:w-[35px]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full ring-0 transition-transform data-checked:bg-primary-gold-light data-unchecked:bg-[#7E868D] group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:data-unchecked:translate-x-[2px] group-data-[size=sm]/switch:data-unchecked:translate-x-[2px] group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
