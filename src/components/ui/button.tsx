"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-12 items-center justify-center font-medium gap-2 whitespace-nowrap rounded-[16px] border border-transparent bg-clip-padding px-5 text-[15px] outline-none transition-all select-none shrink-0 active:scale-95 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 disabled:cursor-not-allowed disabled:bg-alertSoft-disabled disabled:text-alert-disabled focus-visible:ring-3 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "bg-primary-black text-primary-white hover:opacity-90",
        gold: "bg-primary-gold-brand text-primary-white hover:opacity-90",
        outline:
          "border-2 border-primary-black bg-transparent text-text-black hover:bg-primary-black/5",
        "outline-gold":
          "border-2 border-primary-gold-brand bg-transparent text-primary-gold-brand hover:bg-primary-gold-brand/10",
        ghost: "bg-transparent text-text-grey hover:bg-primary-grey-undertone hover:text-text-black",
        "table-action":
          "border border-primary-grey-stroke bg-primary-grey-undertone text-primary-gold-brand hover:bg-primary-white",
      },
      size: {
        default: "has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-[20px] px-6 text-base",
        icon: "size-8",
        "table-action": "h-9 w-9 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  pending = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    pending?: boolean;
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      aria-busy={pending || undefined}
      disabled={disabled || pending}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {pending ? <Spinner aria-hidden className="size-4" /> : null}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
