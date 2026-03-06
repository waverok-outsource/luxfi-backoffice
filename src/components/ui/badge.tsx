import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        active: "bg-alertSoft-success text-alert-success",
        success: "bg-alertSoft-success text-alert-success",
        warning: "bg-alertSoft-warning text-alert-warning",
        error: "bg-alertSoft-error text-alert-error",
        danger: "bg-alertSoft-error text-alert-error",
        neutral: "bg-alertSoft-neutral text-alert-neutral",
        disabled: "bg-alertSoft-disabled text-alert-disabled",
      },
    },
    defaultVariants: {
      variant: "active",
    },
  },
);

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    showStatusDot?: boolean;
  };

function Badge({
  className,
  variant = "active",
  showStatusDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {showStatusDot ? <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
